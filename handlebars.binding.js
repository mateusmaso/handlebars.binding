(function(Handlebars) {

  var store = {};
  var increment = 0;

  var isObject = function(object) {
    return object === Object(object);
  };

  var isString = function(object) {
    return toString.call(object) == '[object String]';
  };

  var isArray = function(object) {
    return toString.call(object) == '[object Array]';
  };

  var isFalsy = function(object) {
    return !object || Handlebars.Utils.isEmpty(object);
  };

  var path = function(context, key) {
    var paths = key.split('.');
    var object = context[paths.shift()];

    for (var index = 0; index < paths.length; index++) {
      object = object[paths[index]];
    }

    return object;
  };

  var extend = function(object, source) {
    for (var key in source) {
      object[key] = source[key];
    }

    return object;
  };

  var flatten = function(array, flattenArray) {
    flattenArray = flattenArray || [];

    for (var index = 0; index < array.length; index++) {
      if (isArray(array[index])) {
        flatten(array[index], flattenArray);
      } else {
        flattenArray.push(array[index]);
      }
    };

    return flattenArray;
  };

  var insertAfter = function(node, nodes) {
    nodes = isArray(nodes) ? nodes.slice() : [nodes];
    nodes.unshift(node);

    for (var index = 1; index < nodes.length; index++) {
      if (nodes[index - 1].nextSibling) {
        nodes[index - 1].parentNode.insertBefore(nodes[index], nodes[index - 1].nextSibling);
      } else {
        nodes[index - 1].parentNode.appendChild(nodes[index]);
      }
    }
  };

  var insertBefore = function(node, nodes) {
    nodes = isArray(nodes) ? nodes.slice() : [nodes];
    nodes.unshift(node);

    for (var index = 1; index < nodes.length; index++) {
      nodes[index - 1].parentNode.insertBefore(nodes[index], nodes[index - 1]);
    }
  };

  var removeBetween = function(firstNode, lastNode) {
    var next = firstNode.nextSibling;

    while (next && next != lastNode) {
      var sibling = next.nextSibling;
      next.remove();
      next = sibling;
    }
  };

  var hasClass = function(node, value) {
    return node.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
  };

  var addClass = function(node, value) {
    if (!hasClass(node, value)) {
      node.className += " " + value;
    }
  };

  var removeClass = function(node, value) {
    if (hasClass(node, value)) {
      node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), ' ');
    }
  };

  var createElementBinding = function(id) {
    return "<hb-binding id='" + id + "'></hb-binding>";
  };

  var createAttributeBinding = function(id) {
    return "hb-binding-" + id;
  };

  Handlebars.registerHelper('bind', function(keypath, options) {
    var node, nodes, observer, attribute, previousValue;
    var context = this;
    var value = path(this, keypath);
    var marker = document.createTextNode("");
    var delimiter = document.createTextNode("");
    var id = ++increment;

    var react = function() {
      if (!document.body.contains(marker) && !document.body.contains(node)) {
        return observer.close();
      }

      if (options.hash.attr) {
        if (options.hash.attr == "class") {
          removeClass(node, previousValue);
          if (value) addClass(node, value); 
        } else if (options.hash.attr == true) {
          node.removeAttribute(previousValue);
          if (value) node.setAttribute(value, '');
        } else {
          if (value) {
            node.setAttribute(options.hash.attr, value);
          } else {
            node.removeAttribute(options.hash.attr);
          }
        }
      } else if (!options.fn) {
        node.textContent = value;
      } else {
        nodes = Handlebars.parseHTML(options.fn(context));
        removeBetween(marker, delimiter);
        insertAfter(marker, nodes);
      }
    };

    var observe = function() {
      if (isArray(value)) {
        return new ArrayObserver(value, function() {
          react();
        });
      } else if (isObject(value)) {
        return new ObjectObserver(value, function() {
          react();
        });
      } else {
        return new PathObserver(context, keypath, function(newValue) {
          previousValue = value;
          value = newValue;
          react();
        });
      }
    };

    observer = observe();

    if (options.hash.attr) {
      Handlebars.registerAttribute("binding-" + id, function() {
        node = this.ownerElement;
        
        if (options.hash.attr == "class") {
          attribute = node.attributes.class;
          if (value) addClass(node, value);
        } else if (options.hash.attr == true) {
          if (value) attribute = document.createAttribute(value);
          if (attribute) return attribute;
        } else {
          attribute = document.createAttribute(options.hash.attr);
          if (value) attribute.value = value;
          return attribute;
        }
      });

      return createAttributeBinding(id);
    } else if (!options.fn) {
      node = document.createTextNode(value);
      store[id] = flatten([node]);

      return new Handlebars.SafeString(createElementBinding(id));
    } else {
      nodes = Handlebars.parseHTML(options.fn(this));
      store[id] = flatten([marker, nodes, delimiter]);

      return new Handlebars.SafeString(createElementBinding(id));
    }
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    var node, nodes, observer, attribute, keypath, falsy, output, previousOutput;
    var context = this;
    var marker = document.createTextNode("");
    var delimiter = document.createTextNode("");
    var id = ++increment;

    var render = function() {
      if (falsy) {
        return options.inverse ? options.inverse(context) : options.hash.else;
      } else {
        return options.fn ? options.fn(context) : options.hash.then;
      }
    };

    var react = function() {
      if (!document.body.contains(marker) && !document.body.contains(node)) {
        return observer.close();
      }

      if (options.hash.attr) {
        if (options.hash.attr == "class") {
          removeClass(node, previousOutput);
          if (output) addClass(node, output);
        } else if (options.hash.attr == true) {
          node.removeAttribute(previousOutput);
          if (output) node.setAttribute(output, '');
        } else {
          if (output) {
            node.setAttribute(options.hash.attr, output);
          } else {
            node.removeAttribute(options.hash.attr);
          }
        }
      } else {
        nodes = Handlebars.parseHTML(output);
        removeBetween(marker, delimiter);
        insertAfter(marker, nodes);
      }
    };

    var observe = function() {
      if (isArray(conditional)) {
        return new ArrayObserver(conditional, function() {
          if (isFalsy(conditional) != falsy) {
            falsy = isFalsy(conditional);
            previousOutput = output;
            output = render();
            react();
          }
        });
      } else {
        return new PathObserver(context, keypath, function(newConditional) {
          conditional = newConditional;

          if (isFalsy(conditional) != falsy) {
            falsy = isFalsy(conditional);
            previousOutput = output;
            output = render();
            react();
          }
        });
      }
    };

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && isString(conditional)) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    falsy = isFalsy(conditional);
    output = render();

    if (options.hash.bind) {
      observer = observe();

      if (options.hash.attr) {
        Handlebars.registerAttribute("binding-" + id, function() {
          node = this.ownerElement;
          
          if (options.hash.attr == "class") {
            attribute = node.attributes.class;
            if (output) addClass(node, output);
          } else if (options.hash.attr == true) {
            if (output) attribute = document.createAttribute(output);
            if (attribute) return attribute;
          } else {
            attribute = document.createAttribute(options.hash.attr);
            if (output) attribute.value = output;
            return attribute;
          }
        });

        return createAttributeBinding(id);
      } else {
        nodes = Handlebars.parseHTML(output);
        store[id] = flatten([marker, nodes, delimiter]);
        observer = observe();

        return new Handlebars.SafeString(createElementBinding(id));
      }
    } else {
      return output;
    }
  });

  Handlebars.registerHelper("unless", function(conditional, options) {
    var fn = options.fn;
    var inverse = options.inverse;
    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return Handlebars.helpers['if'].apply(this, [conditional, options]);
  });

  Handlebars.registerHelper('each', function(items, options) {
    var node, observer, output;
    var context = this;
    var marker = document.createTextNode("");
    var markers = [];
    var delimiter = document.createTextNode("");
    var delimiters = [];
    var nodes = [];
    var empty = items.length == 0;
    var id = ++increment;

    var render = function() {
      output = "";

      for (var index = 0; index < items.length; index++) {
        output += renderItem(items[index], index);
      }

      return items.length ? output : options.inverse(context);
    };

    var renderItem = function(item, index) {
      var itemContext = extend({}, context);
      itemContext[options.hash.var] = item;
      itemContext.index = index;

      return options.fn(itemContext);
    };

    var react = function(splice) {
      if (!document.body.contains(marker)) {
        return observer.close();
      }

      if (items.length == 0 && !empty) {
        empty = true;
        output = render();
        insertAfter(marker, Handlebars.parseHTML(output));
      }
      
      if (items.length > 0 && empty) {
        empty = false;
        removeBetween(marker, delimiter);
      }

      if (splice.removed.length > 0) {
        for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
          if (options.hash.single) {
            nodes[index].remove();
          } else {
            removeBetween(markers[index], delimiters[index]);
            markers[index].remove();
            delimiters[index].remove();
          }
        }

        for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
          if (options.hash.single) {
            nodes.splice(index, 1);
          } else {
            markers.splice(index, 1);
            delimiters.splice(index, 1);
          }
        }
      }

      if (splice.addedCount > 0) {
        for (var index = splice.index; index < (splice.index + splice.addedCount); index++) {
          var item = items[index];
          
          if (options.hash.single) {
            var itemNode = Handlebars.parseHTML(renderItem(item, index))[0];
            var previous = nodes[index - 1] || marker;
            
            insertAfter(previous, itemNode);
            nodes.splice(index, 0, itemNode);
          } else {
            var itemMarker = document.createTextNode("");
            var itemDelimiter = document.createTextNode("");
            var itemNode = Handlebars.parseHTML(renderItem(item, index));
            var previous = delimiters[index - 1] || marker;

            insertAfter(previous, flatten([itemMarker, itemNode, itemDelimiter]))
            markers.splice(index, 0, itemMarker);
            delimiters.splice(index, 0, itemDelimiter);
          }
        }
      }
    };

    var observe = function() {
      return new ArrayObserver(items, function(splices) {
        for (var index = 0; index < splices.length; index++) {
          react(splices[index]);
        }
      });
    };

    output = render();

    if (options.hash.bind) {
      for (var index = 0; index < items.length; index++) {
        var item = items[index];

        if (options.hash.single) {
          var itemNode = Handlebars.parseHTML(renderItem(item, index))[0];
          nodes.push(itemNode);
        } else {
          var itemMarker = document.createTextNode("");
          var itemDelimiter = document.createTextNode("");
          var itemNode = Handlebars.parseHTML(renderItem(item, index));

          markers.push(itemMarker);
          delimiters.push(itemDelimiter);
          nodes.push(itemMarker, itemNode, itemDelimiter);
        }
      }

      observer = observe();
      nodes = flatten(nodes);
      store[id] = flatten([marker, (empty ? Handlebars.parseHTML(output) : nodes), delimiter]);

      return new Handlebars.SafeString(createElementBinding(id));
    } else {
      return output;
    }
  });

  Handlebars.registerElement('binding', function(attributes) {
    var element = store[attributes.id]
    delete store[attributes.id];
    return element;
  });

})(Handlebars);

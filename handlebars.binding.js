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
  }

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

  var toElement = function(nodes) {
    store[++increment] = flatten(nodes);
    return new Handlebars.SafeString("<hb-binding id='" + increment + "'></hb-binding>");
  };

  Handlebars.registerHelper('bind', function(keypath, options) {
    var node, nodes, observer;
    var context = this;
    var single = !options.fn;
    var value = path(this, keypath);
    var marker = document.createTextNode("");
    var delimiter = document.createTextNode("");

    var react = function(value) {
      if (!document.body.contains(marker)) {
        observer.close();
        return false;
      }

      if (single) {
        node.textContent = value;
      } else {
        nodes = Handlebars.parseHTML(options.fn(context));
        removeBetween(marker, delimiter);
        insertAfter(marker, nodes);
      }
    };

    var observe = function(value, context, keypath) {
      if (isArray(value)) {
        return new ArrayObserver(value, function() {
          react(value);
        });
      } else if (isObject(value)) {
        return new ObjectObserver(value, function() {
          react(value);
        });
      } else {
        return new PathObserver(context, keypath, function(value) {
          react(value);
        });
      }
    };

    observer = observe(value, this, keypath);

    if (single) {
      node = document.createTextNode(value);
      return toElement([node]);
    } else {
      nodes = Handlebars.parseHTML(options.fn(this));
      return toElement([marker, nodes, delimiter]);
    }
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    var nodes, observer, keypath, falsy;
    var context = this;
    var marker = document.createTextNode("");
    var delimiter = document.createTextNode("");

    if (isString(conditional) && options.hash.bind) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    var isFalsy = function(conditional) {
      return !conditional || Handlebars.Utils.isEmpty(conditional);
    };

    var render = function(conditional) {
      if (falsy) {
        return options.inverse ? options.inverse(context) : options.hash.else;
      } else {
        return options.fn ? options.fn(context) : options.hash.then;
      }
    };

    var react = function(conditional) {
      if (!document.body.contains(marker)) {
        observer.close();
        return false;
      }

      if (isFalsy(conditional) != falsy) {
        falsy = isFalsy(conditional);
        nodes = Handlebars.parseHTML(render(conditional));
        removeBetween(marker, delimiter);
        insertAfter(marker, nodes);
      }
    };

    var observe = function(conditional, context, keypath) {
      if (isArray(conditional)) {
        return new ArrayObserver(conditional, function() {
          react(conditional);
        });
      } else {
        return new PathObserver(context, keypath, function(conditional) {
          react(conditional);
        });
      }
    };

    falsy = isFalsy(conditional);

    if (options.hash.bind) {
      observer = observe(conditional, this, keypath);
      nodes = Handlebars.parseHTML(render(conditional));
      return toElement([marker, nodes, delimiter]);
    } else {
      return render(conditional);
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
    var node, nodes, observer, empty;
    var context = this;
    var marker = document.createTextNode("");
    var markers = [];
    var delimiter = document.createTextNode("");
    var delimiters = [];

    var render = function() {
      var output = "";

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
        observer.close();
        return false;
      }

      if (items.length == 0 && !empty) {
        empty = true;
        insertAfter(marker, Handlebars.parseHTML(render()));
      }
      
      if (items.length > 0 && empty) {
        empty = false;
        removeBetween(marker, delimiter);
      }

      if (splice.removed.length > 0) {
        for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
          var item = items[index];

          if (options.hash.single) {
            nodes[index].remove();
            nodes.splice(index, 1);
          } else {
            removeBetween(markers[index], delimiters[index]);

            markers[index].remove();
            delimiters[index].remove();
            markers.splice(index, 1);
            delimiters.splice(index, 1);
          }
        }
      }

      if (splice.addedCount > 0) {
        for (var index = splice.index; index < (splice.index + splice.addedCount); index++) {
          var item = items[index];
          
          if (options.hash.single) {
            var itemNode = Handlebars.parseHTML(renderItem(item, index));
            var previous = nodes[index - 1] || marker;
            
            insertAfter(previous[previous.length - 1], itemNode);
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

    var observe = function(items) {
      return new ArrayObserver(items, function(splices) {
        for (var index = 0; index < splices.length; index++) {
          react(splices[index]);
        }
      });
    };

    if (options.hash.bind) {
      observer = observe(items);
      empty = items.length == 0;
      nodes = [];

      for (var index = 0; index < items.length; index++) {
        var item = items[index];

        if (options.hash.single) {
          var itemNode = Handlebars.parseHTML(renderItem(item, index));
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

      return toElement([marker, (empty ? Handlebars.parseHTML(render()) : nodes), delimiter]);
    } else {
      return render();
    }
  });

  Handlebars.registerElement('binding', function(attributes) {
    var element = store[attributes.id]
    delete store[attributes.id];
    return element;
  });

})(Handlebars);

// handlebars.binding
// ------------------
// v0.1.3
//
// Copyright (c) 2013-2015 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/handlebars.binding

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(global.Handlebars);
    exports = factory(global.Handlebars);
  } else {
    factory(root.Handlebars);
  }

}(this, function(Handlebars) {

  var Utils = Handlebars.Utils;

  var createElementBinding = function(id) {
    return "<hb-binding id='" + id + "'></hb-binding>";
  };

  var createAttributeBinding = function(id) {
    return "hb-binding-" + id;
  };

  Handlebars.Utils.isFalsy = function(object) {
    return !object || Utils.isEmpty(object);
  };

  Handlebars.Utils.hasClass = function(node, value) {
    return node.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
  };

  Handlebars.Utils.addClass = function(node, value) {
    if (!Utils.hasClass(node, value)) {
      if (node.className.length == 0) {
        return node.className = value;
      } else {
        return node.className += " " + value;
      }
    }
  };

  Handlebars.Utils.removeClass = function(node, value) {
    if (Utils.hasClass(node, value)) {
      return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
    }
  };

  Handlebars.Utils.removeBetween = function(firstNode, lastNode) {
    var next = firstNode.nextSibling;

    while (next && next != lastNode) {
      var sibling = next.nextSibling;
      next.remove();
      next = sibling;
    }
  };

  Handlebars.Utils.path = function(context, key) {
    var paths = key.split('.');
    var object = context[paths.shift()];

    for (var index = 0; index < paths.length; index++) {
      object = object[paths[index]];
    }

    return object;
  };

  Handlebars.registerHelper('bind', function(keypath, options) {
    var node, nodes, observer, attribute, previousValue;
    var delimiter = document.createTextNode("");
    var marker = document.createTextNode("");
    var value = Utils.path(this, keypath);
    var id = Utils.uniqueId();
    var context = this;

    var react = function() {
      try {
        if (options.hash.attr) {
          if (options.hash.attr == true) {
            node.removeAttribute(previousValue);
            node.setAttribute(value, '');
          } else if (options.hash.attr == "class") {
            Utils.removeClass(node, previousValue);
            Utils.addClass(node, value);
          } else {
            node.setAttribute(options.hash.attr, value);
          }
        } else if (!options.fn) {
          if (Utils.isString(value)) {
            node.textContent = Utils.escapeExpression(new Handlebars.SafeString(value));
          } else {
            node.textContent = Utils.escapeExpression(value);
          }
        } else {
          nodes = Handlebars.parseHTML(options.fn(context));
          Utils.removeBetween(marker, delimiter);
          Utils.insertAfter(marker, nodes);
        }
      } catch(exception) {
        observer.close();
      }
    };

    if (Utils.isArray(value)) {
      observer = new ArrayObserver(value);
      observer.open(function() {
        react();
      });
    } else if (Utils.isObject(value)) {
      observer = new ObjectObserver(value);
      observer.open(function() {
        react();
      });
    } else {
      observer = new PathObserver(context, keypath);
      observer.open(function(newValue) {
        previousValue = value;
        value = newValue;
        react();
      });
    }

    if (options.hash.attr) {
      Handlebars.registerAttribute("binding-" + id, function(element) {
        if (options.hash.attr == true) {
          attribute = document.createAttribute(value);
          return attribute;
        } else if (options.hash.attr == "class") {
          attribute = element.attributes.class;
          Utils.addClass(element, value);
        } else {
          attribute = document.createAttribute(options.hash.attr);
          attribute.value = value;
          return attribute;
        }
      }, {
        ready: function(element) {
          node = element;
        }
      });

      return createAttributeBinding(id);
    } else if (!options.fn) {
      if (Utils.isString(value)) {
        node = document.createTextNode(Utils.escapeExpression(new Handlebars.SafeString(value)));
      } else {
        node = document.createTextNode(Utils.escapeExpression(value));
      }

      Handlebars.store.hold(id, Utils.flatten([node]));
      return new Handlebars.SafeString(createElementBinding(id));
    } else {
      nodes = Handlebars.parseHTML(options.fn(this));
      Handlebars.store.hold(id, Utils.flatten([marker, nodes, delimiter]));
      return new Handlebars.SafeString(createElementBinding(id));
    }
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    var node, nodes, observer, attribute, keypath, falsy, output, previousOutput;
    var delimiter = document.createTextNode("");
    var marker = document.createTextNode("");
    var id = Utils.uniqueId();
    var context = this;

    var render = function() {
      if (falsy) {
        return options.inverse ? options.inverse(context) : options.hash.else;
      } else {
        return options.fn ? options.fn(context) : options.hash.then;
      }
    };

    var react = function() {
      try {
        if (options.hash.attr) {
          if (options.hash.attr == true) {
            node.removeAttribute(previousOutput);
            if (output) node.setAttribute(output, "");
          } else if (options.hash.attr == "class") {
            Utils.removeClass(node, previousOutput);
            if (output) Utils.addClass(node, output);
          } else {
            node.setAttribute(options.hash.attr, output);
          }
        } else if (!options.fn) {
          if (Utils.isString(output)) {
            node.textContent = Utils.escapeExpression(new Handlebars.SafeString(output));
          } else {
            node.textContent = Utils.escapeExpression(output);
          }
        } else {
          nodes = Handlebars.parseHTML(output);
          Utils.removeBetween(marker, delimiter);
          Utils.insertAfter(marker, nodes);
        }
      } catch(exception) {
        observer.close();
      }
    };

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && Utils.isString(conditional)) {
      keypath = conditional;
      conditional = Utils.path(this, keypath);
    }

    falsy = Utils.isFalsy(conditional);
    output = render();

    if (options.hash.bind) {
      if (Utils.isArray(conditional)) {
        observer = new ArrayObserver(conditional);
        observer.open(function() {
          if (Utils.isFalsy(conditional) != falsy) {
            falsy = Utils.isFalsy(conditional);
            previousOutput = output;
            output = render();
            react();
          }
        });
      } else {
        observer = new PathObserver(context, keypath);
        observer.open(function(newConditional) {
          conditional = newConditional;
          if (Utils.isFalsy(conditional) != falsy) {
            falsy = Utils.isFalsy(conditional);
            previousOutput = output;
            output = render();
            react();
          }
        });
      }

      if (options.hash.attr) {
        Handlebars.registerAttribute("binding-" + id, function(element) {
          if (options.hash.attr == true) {
            if (output) attribute = document.createAttribute(output);
            if (attribute) return attribute;
          } else if (options.hash.attr == "class") {
            attribute = element.attributes.class;
            if (output) Utils.addClass(element, output);
          } else {
            attribute = document.createAttribute(options.hash.attr);
            attribute.value = output;
            return attribute;
          }
        }, {
          ready: function(element) {
            node = element;
          }
        });

        return createAttributeBinding(id);
      } else if (!options.fn) {
        if (Utils.isString(output)) {
          node = document.createTextNode(Utils.escapeExpression(new Handlebars.SafeString(output)));
        } else {
          node = document.createTextNode(Utils.escapeExpression(output));
        }

        Handlebars.store.hold(id, Utils.flatten([node]));
        return new Handlebars.SafeString(createElementBinding(id));
      } else {
        nodes = Handlebars.parseHTML(output);
        Handlebars.store.hold(id, Utils.flatten([marker, nodes, delimiter]));
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
    var delimiter = document.createTextNode("");
    var marker = document.createTextNode("");
    var empty = items.length == 0;
    var id = Utils.uniqueId();
    var context = this;

    var delimiters = [];
    var markers = [];
    var nodes = [];

    var render = function() {
      output = "";

      for (var index = 0; index < items.length; index++) {
        output += renderItem(items[index], index);
      }

      return items.length ? output : options.inverse(context);
    };

    var renderItem = function(item, index) {
      var itemContext = Utils.extend({index: index}, context);
      var contextObserver = new ObjectObserver(context);

      contextObserver.open(function() {
        itemContext = Utils.extend(itemContext, context);
      });

      if (options.hash.var) {
        itemContext[options.hash.var] = item;
      } else {
        itemContext = Utils.extend(itemContext, item);
      }

      return options.fn(itemContext);
    };

    var react = function(splice) {
      try {
        if (items.length == 0 && !empty) {
          empty = true;
          output = render();
          Utils.insertAfter(marker, Handlebars.parseHTML(output));
        }

        if (items.length > 0 && empty) {
          empty = false;
          Utils.removeBetween(marker, delimiter);
        }

        if (splice.removed.length > 0) {
          for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
            Utils.removeBetween(markers[index], delimiters[index]);
            markers[index].remove();
            delimiters[index].remove();
          }

          for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
            markers.splice(index, 1);
            delimiters.splice(index, 1);
          }
        }

        if (splice.addedCount > 0) {
          for (var index = splice.index; index < (splice.index + splice.addedCount); index++) {
            var item = items[index];
            var itemMarker = document.createTextNode("");
            var itemDelimiter = document.createTextNode("");
            var itemNode = Handlebars.parseHTML(renderItem(item, index));
            var previous = delimiters[index - 1] || marker;

            Utils.insertAfter(previous, Utils.flatten([itemMarker, itemNode, itemDelimiter]))
            markers.splice(index, 0, itemMarker);
            delimiters.splice(index, 0, itemDelimiter);
          }
        }
      } catch(exception) {
        observer.close();
      }
    };

    output = render();

    if (options.hash.bind) {
      observer = new ArrayObserver(items);
      observer.open(function(splices) {
        for (var index = 0; index < splices.length; index++) {
          react(splices[index]);
        }
      });

      for (var index = 0; index < items.length; index++) {
        var item = items[index];
        var itemMarker = document.createTextNode("");
        var itemDelimiter = document.createTextNode("");
        var itemNode = Handlebars.parseHTML(renderItem(item, index));

        markers.push(itemMarker);
        delimiters.push(itemDelimiter);
        nodes.push(itemMarker, itemNode, itemDelimiter);
      }

      nodes = Utils.flatten(nodes);
      Handlebars.store.hold(id, Utils.flatten([marker, (empty ? Handlebars.parseHTML(output) : nodes), delimiter]));
      return new Handlebars.SafeString(createElementBinding(id));
    } else {
      return output;
    }
  });

  Handlebars.registerElement('binding', function(attributes) {
    return attributes.id;
  });

}));

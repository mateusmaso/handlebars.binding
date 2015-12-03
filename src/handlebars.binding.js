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

  Handlebars.Utils.nodesBetween = function(firstNode, lastNode) {
    var next = firstNode.nextSibling;
    var nodes = [];

    while (next && next != lastNode) {
      var sibling = next.nextSibling;
      nodes.push(next);
      next = sibling;
    }

    return nodes;
  };

  Handlebars.Utils.removeBetween = function(firstNode, lastNode) {
    var nodes = Utils.nodesBetween(firstNode, lastNode);

    for (var index = 0; index < nodes.length; index++) {
      var node = nodes[index];
      Handlebars.unbind(node);
      node.remove();
    }
  };

  Handlebars.Utils.traverse = function(node, callback) {
    callback.apply(this, [node]);
    node = node.firstChild;
    while (node) {
      Utils.traverse(node, callback);
      node = node.nextSibling;
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

  Handlebars.Binding = function(context, keypath, value, options) {
    this.id = Utils.uniqueId();

    this.node;
    this.observer;
    this.output;
    this.previousOutput;

    this.context = context;
    this.keypath = keypath;
    this.options = options;
    this.value = value;
    if (keypath) this.value = Utils.path(this.context, this.keypath);

    this.marker = document.createTextNode("");
    this.delimiter = document.createTextNode("");

    this.render();
  };

  Handlebars.Binding.prototype.initialize = function() {
    if (this.options.hash.attr) {
      var attributeName = "binding-" + this.id;

      Handlebars.registerAttribute(attributeName, function(node) {
        return this.initializeAttribute(node);
      }.bind(this), {
        ready: function(node) {
          this.observe();
          this.setNode(node);
          delete Handlebars.attributes[attributeName];
        }.bind(this)
      });

      return this.createAttribute();
    } else if (!this.options.fn) {
      this.observe();
      this.setNode(this.initializeInline());
      Handlebars.store.hold(this.id, Utils.flatten([this.node]));
      return new Handlebars.SafeString(this.createElement());
    } else {
      this.observe();
      this.marker.binding = this;
      Handlebars.store.hold(this.id, Utils.flatten([this.marker, this.initializeBlock(), this.delimiter]));
      return new Handlebars.SafeString(this.createElement());
    }
  };

  Handlebars.Binding.prototype.render = function() {
    if (this.options.fn) {
      return this.setOutput(this.options.fn(this.context));
    } else {
      return this.setOutput(this.value);
    }
  };

  Handlebars.Binding.prototype.initializeAttribute = function(node) {
    if (this.options.hash.attr == true) {
      return document.createAttribute(this.value);
    } else if (this.options.hash.attr == "class") {
      Utils.addClass(node, this.value);
      return node.attributes.class;
    } else {
      var attribute = document.createAttribute(this.options.hash.attr);
      attribute.value = this.value;
      return attribute;
    }
  };

  Handlebars.Binding.prototype.initializeInline = function() {
    if (Utils.isString(this.value)) {
      return document.createTextNode(Utils.escapeExpression(new Handlebars.SafeString(this.output)));
    } else {
      return document.createTextNode(Utils.escapeExpression(this.output));
    }
  };

  Handlebars.Binding.prototype.initializeBlock = function() {
    return Handlebars.parseHTML(this.output);
  };

  Handlebars.Binding.prototype.observeContext = function(context) {
    var observer = new ObjectObserver(this.context);

    observer.open(function() {
      Utils.extend(context, this.context);
    }.bind(this));

    return context;
  };

  Handlebars.Binding.prototype.observe = function() {
    if (Utils.isArray(this.value)) {
      this.observer = new ArrayObserver(this.value);
      this.observer.open(function() {
        this.render();
        this.react();
      }.bind(this));
    } else if (Utils.isObject(this.value)) {
      this.observer = new ObjectObserver(this.value);
      this.observer.open(function() {
        this.render();
        this.react();
      }.bind(this));
    } else {
      this.observer = new PathObserver(this.context, this.keypath);
      this.observer.open(function(value) {
        this.value = value;
        this.render();
        this.react();
      }.bind(this));
    }
  };

  Handlebars.Binding.prototype.stopObserving = function() {
    this.observer.close();
  };

  Handlebars.Binding.prototype.react = function() {
    if (this.options.hash.attr) {
      if (this.options.hash.attr == true) {
        this.node.removeAttribute(this.previousOutput);
        this.node.setAttribute(this.output, '');
      } else if (this.options.hash.attr == "class") {
        Utils.removeClass(this.node, this.previousOutput);
        Utils.addClass(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    } else if (!this.options.fn) {
      if (Utils.isString(this.output)) {
        this.node.textContent = Utils.escapeExpression(new Handlebars.SafeString(this.output));
      } else {
        this.node.textContent = Utils.escapeExpression(this.output);
      }
    } else {
      Utils.removeBetween(this.marker, this.delimiter);
      Utils.insertAfter(this.marker, Handlebars.parseHTML(this.output));
    }
  };

  Handlebars.Binding.prototype.setNode = function(node) {
    node.bindings = node.bindings || [];
    node.bindings.push(this);
    return this.node = node;
  };

  Handlebars.Binding.prototype.setOutput = function(output) {
    this.previousOutput = this.output;
    return this.output = output;
  };

  Handlebars.Binding.prototype.createElement = function() {
    return "<hb-binding id='" + this.id + "'></hb-binding>";
  };

  Handlebars.Binding.prototype.createAttribute = function() {
    return "hb-binding-" + this.id;
  };

  Handlebars.IfBinding = function(context, keypath, value, options) {
    this.falsy = Utils.isFalsy(value);
    return Handlebars.Binding.apply(this, arguments);
  };

  Handlebars.IfBinding.prototype = Object.create(Handlebars.Binding.prototype);

  Handlebars.IfBinding.prototype.initializeAttribute = function(node) {
    if (this.options.hash.attr == true) {
      if (this.output) return document.createAttribute(this.output);
    } else if (this.options.hash.attr == "class") {
      if (this.output) Utils.addClass(node, this.output);
      return node.attributes.class;
    } else {
      var attribute = document.createAttribute(this.options.hash.attr);
      attribute.value = this.output;
      return attribute;
    }
  }

  Handlebars.IfBinding.prototype.react = function() {
    if (this.options.hash.attr) {
      if (this.options.hash.attr == true) {
        this.node.removeAttribute(this.previousOutput);
        if (this.output) this.node.setAttribute(this.output, "");
        return;
      }
    }

    return Handlebars.Binding.prototype.react.apply(this, arguments);
  };

  Handlebars.IfBinding.prototype.render = function() {
    if (this.falsy) {
      this.setOutput(this.options.inverse ? this.options.inverse(this.context) : this.options.hash.else);
    } else {
      this.setOutput(this.options.fn ? this.options.fn(this.context) : this.options.hash.then);
    }
  };

  Handlebars.IfBinding.prototype.observe = function() {
    if (Utils.isArray(this.value)) {
      this.observer = new ArrayObserver(this.value);
      this.observer.open(function() {
        if (Utils.isFalsy(this.value) != this.falsy) {
          this.falsy = Utils.isFalsy(this.value);
          this.render();
          this.react();
        }
      }.bind(this));
    } else {
      this.observer = new PathObserver(this.context, this.keypath);
      this.observer.open(function(value) {
        this.value = value;
        if (Utils.isFalsy(this.value) != this.falsy) {
          this.falsy = Utils.isFalsy(this.value);
          this.render();
          this.react();
        }
      }.bind(this));
    }
  };

  Handlebars.EachBinding = function(context, keypath, value, options) {
    this.markers = [];
    this.delimiters = [];
    this.empty = value.length == 0;
    return Handlebars.Binding.apply(this, arguments);
  };

  Handlebars.EachBinding.prototype = Object.create(Handlebars.Binding.prototype);

  Handlebars.EachBinding.prototype.observe = function() {
    this.observer = new ArrayObserver(this.value);
    this.observer.open(function(splices) {
      for (var index = 0; index < splices.length; index++) {
        this.react(splices[index]);
      }
    }.bind(this));
  };

  Handlebars.EachBinding.prototype.react = function(splice) {
    if (this.value.length == 0 && !this.empty) {
      this.empty = true;
      this.render();
      Utils.insertAfter(this.marker, Handlebars.parseHTML(this.output));
    }

    if (this.value.length > 0 && this.empty) {
      this.empty = false;
      Utils.removeBetween(this.marker, this.delimiter);
    }

    if (splice.removed.length > 0) {
      for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
        Utils.removeBetween(this.markers[index], this.delimiters[index]);
        this.markers[index].remove();
        this.delimiters[index].remove();
      }

      for (var index = splice.index; index < (splice.index + splice.removed.length); index++) {
        this.markers.splice(index, 1);
        this.delimiters.splice(index, 1);
      }
    }

    if (splice.addedCount > 0) {
      for (var index = splice.index; index < (splice.index + splice.addedCount); index++) {
        var item = this.value[index];
        var itemMarker = document.createTextNode("");
        var itemDelimiter = document.createTextNode("");
        var itemNode = Handlebars.parseHTML(this.renderItem(item, index));
        var previous = this.delimiters[index - 1] || this.marker;

        Utils.insertAfter(previous, Utils.flatten([itemMarker, itemNode, itemDelimiter]))
        this.markers.splice(index, 0, itemMarker);
        this.delimiters.splice(index, 0, itemDelimiter);
      }
    }
  };

  Handlebars.EachBinding.prototype.render = function() {
    var output = "";

    for (var index = 0; index < this.value.length; index++) {
      output += this.renderItem(this.value[index], index);
    }

    this.setOutput(this.value.length ? output : this.options.inverse(this.context));
  };

  Handlebars.EachBinding.prototype.renderItem = function(item, index) {
    var context = Utils.extend({index: index}, this.context);

    if (this.options.hash.var) {
      context[this.options.hash.var] = item;
    } else {
      context = Utils.extend(context, item);
    }

    if (this.options.hash.bind) {
      return this.options.fn(this.observeContext(context));
    } else {
      return this.options.fn(context);
    }
  };

  Handlebars.EachBinding.prototype.initializeBlock = function() {
    if (this.empty) {
      return Handlebars.parseHTML(this.output);
    } else {
      var nodes = [];

      for (var index = 0; index < this.value.length; index++) {
        var item = this.value[index];
        var itemMarker = document.createTextNode("");
        var itemDelimiter = document.createTextNode("");
        var itemNode = Handlebars.parseHTML(this.renderItem(item, index));

        this.markers.push(itemMarker);
        this.delimiters.push(itemDelimiter);
        nodes.push(itemMarker, itemNode, itemDelimiter);
      }

      return Utils.flatten(nodes);
    }
  };

  Handlebars.bind = function(root) {
    Utils.traverse(root, function(node) {
      if (node.binding) {
        node.binding.observe();
      } else if (node.bindings) {
        for (var index = 0; index < node.bindings.length; index++) {
          node.bindings[index].observe();
        }
      }
    });
  };

  Handlebars.unbind = function(root) {
    Utils.traverse(root, function(node) {
      if (node.binding) {
        node.binding.stopObserving();
      } else if (node.bindings) {
        for (var index = 0; index < node.bindings.length; index++) {
          node.bindings[index].stopObserving();
        }
      }
    });
  };

  Handlebars.registerHelper('bind', function(keypath, options) {
    var binding = new Handlebars.Binding(this, keypath, null, options);
    return binding.initialize();
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && Utils.isString(conditional)) {
      keypath = conditional;
      conditional = Utils.path(this, keypath);
    }

    var binding = new Handlebars.IfBinding(this, keypath, conditional, options);

    if (options.hash.bind) {
      return binding.initialize();
    } else {
      return binding.output;
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
    var binding = new Handlebars.EachBinding(this, null, items, options);

    if (options.hash.bind) {
      return binding.initialize();
    } else {
      return binding.output;
    }
  });

  Handlebars.registerElement('binding', function(attributes) {
    return attributes.id;
  });

}));

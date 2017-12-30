"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _observeJs = require("observe-js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Binding = function () {
  function Binding(Handlebars, context, keypath, value, options) {
    _classCallCheck(this, Binding);

    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.Handlebars = Handlebars;
    this.id = this.Handlebars.Utils.uniqueId();
    this.value = value;
    this.context = context;
    this.keypath = keypath;
    this.options = options;
    if (keypath) this.value = this.Handlebars.Utils.path(this.context, this.keypath);
  }

  _createClass(Binding, [{
    key: "setNode",
    value: function setNode(node) {
      node.bindings = node.bindings || [];
      node.bindings.push(this);
      return this.node = node;
    }
  }, {
    key: "setMarker",
    value: function setMarker(marker) {
      marker.binding = this;
      return this.marker = marker;
    }
  }, {
    key: "setDelimiter",
    value: function setDelimiter(delimiter) {
      return this.delimiter = delimiter;
    }
  }, {
    key: "setOutput",
    value: function setOutput(output) {
      this.previousOutput = this.output;
      return this.output = output;
    }
  }, {
    key: "setObserver",
    value: function setObserver(observer) {
      return this.observer = observer;
    }
  }, {
    key: "createElement",
    value: function createElement() {
      return "<hb-binding id=\"" + this.id + "\"></hb-binding>";
    }
  }, {
    key: "createAttribute",
    value: function createAttribute() {
      return "hb-binding-" + this.id;
    }
  }, {
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.attr) {
        return this.initializeAttribute();
      } else if (!this.options.fn) {
        return this.initializeInline();
      } else {
        return this.initializeBlock();
      }
    }
  }, {
    key: "initializeAttribute",
    value: function initializeAttribute(node) {
      var _this = this;

      var attributeName = "binding-" + this.id;

      this.Handlebars.registerAttribute(attributeName, function (node) {
        return null;
      }, {
        ready: function ready(node) {
          _this.setNode(node);
          _this.render({ initialize: true });
          _this.observe();
          delete _this.Handlebars.attributes[attributeName];
        }
      });

      return this.createAttribute();
    }
  }, {
    key: "initializeInline",
    value: function initializeInline() {
      this.setNode(document.createTextNode(""));
      this.render({ initialize: true });
      this.observe();
      this.Handlebars.store.hold(this.id, this.Handlebars.Utils.flatten([this.node]));
      return new this.Handlebars.SafeString(this.createElement());
    }
  }, {
    key: "initializeBlock",
    value: function initializeBlock() {
      this.setMarker(document.createTextNode(""));
      this.setDelimiter(document.createTextNode(""));
      var nodes = this.render({ initialize: true });
      this.observe();
      this.Handlebars.store.hold(this.id, this.Handlebars.Utils.flatten([this.marker, nodes, this.delimiter]));
      return new this.Handlebars.SafeString(this.createElement());
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.options.fn) {
        this.setOutput(this.options.fn(this.context));
      } else {
        this.setOutput(this.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.runOutput();

      if (this.options.hash.attr) {
        return this.renderAttribute(options);
      } else if (!this.options.fn) {
        return this.renderInline(options);
      } else {
        return this.renderBlock(options);
      }
    }
  }, {
    key: "renderAttribute",
    value: function renderAttribute() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.options.hash.attr == true) {
        if (this.previousOutput != this.output) {
          this.node.removeAttribute(this.previousOutput);
          this.node.setAttribute(this.output, "");
        }
      } else if (this.options.hash.attr == "class") {
        this.Handlebars.Utils.removeClass(this.node, this.previousOutput);
        this.Handlebars.Utils.addClass(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }, {
    key: "renderInline",
    value: function renderInline() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.Handlebars.Utils.isString(this.output)) {
        this.node.textContent = this.Handlebars.Utils.escapeExpression(new this.Handlebars.SafeString(this.output));
      } else {
        this.node.textContent = this.Handlebars.Utils.escapeExpression(this.output);
      }
    }
  }, {
    key: "renderBlock",
    value: function renderBlock() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.initialize) {
        return this.Handlebars.parseHTML(this.output); // gambi
      } else {
        this.Handlebars.Utils.removeBetween(this.marker, this.delimiter).forEach(function (node) {
          return _this2.Handlebars.unbind(node);
        });
        this.Handlebars.Utils.insertAfter(this.marker, this.Handlebars.parseHTML(this.output));
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this3 = this;

      if (this.Handlebars.Utils.isArray(this.value)) {
        this.setObserver(new _observeJs.ArrayObserver(this.value));
        this.observer.open(function () {
          return _this3.render();
        });
      } else if (this.Handlebars.Utils.isObject(this.value)) {
        this.setObserver(new _observeJs.ObjectObserver(this.value));
        this.observer.open(function () {
          return _this3.render();
        });
      } else {
        this.setObserver(new _observeJs.PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this3.value = value;
          _this3.render();
        });
      }
    }
  }, {
    key: "stopObserving",
    value: function stopObserving() {
      if (this.observer) {
        this.observer.close();
      }
    }
  }]);

  return Binding;
}();

exports.default = Binding;

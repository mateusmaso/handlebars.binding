// handlebars.binding
// ------------------
// v0.3.1
//
// Copyright (c) 2013-2016 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/handlebars.binding


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _binding = require('./handlebars.binding/binding');

var _binding2 = _interopRequireDefault(_binding);

var _if_binding = require('./handlebars.binding/if_binding');

var _if_binding2 = _interopRequireDefault(_if_binding);

var _each_binding = require('./handlebars.binding/each_binding');

var _each_binding2 = _interopRequireDefault(_each_binding);

var _core = require('./handlebars.binding/core');

var _utils = require('./handlebars.binding/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = factory(global.Handlebars);
    exports = factory(global.Handlebars);
  } else {
    factory(root.Handlebars);
  }
})(undefined, function (Handlebars) {
  var extend = Handlebars.Utils.extend;


  extend(Handlebars, { Binding: _binding2.default, IfBinding: _if_binding2.default, EachBinding: _each_binding2.default, bind: _core.bind, unbind: _core.unbind, update: _core.update });
  extend(Handlebars.Utils, { path: _utils.path, traverse: _utils.traverse, removeBetween: _utils.removeBetween, nodesBetween: _utils.nodesBetween, removeClass: _utils.removeClass, addClass: _utils.addClass, hasClass: _utils.hasClass, isFalsy: _utils.isFalsy });

  (0, _core.register)();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./handlebars.binding/binding":2,"./handlebars.binding/core":3,"./handlebars.binding/each_binding":4,"./handlebars.binding/if_binding":5,"./handlebars.binding/utils":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Handlebars = Handlebars;
var attributes = _Handlebars.attributes;
var store = _Handlebars.store;
var SafeString = _Handlebars.SafeString;
var _Handlebars$Utils = Handlebars.Utils;
var uniqueId = _Handlebars$Utils.uniqueId;
var flatten = _Handlebars$Utils.flatten;
var isString = _Handlebars$Utils.isString;
var escapeExpression = _Handlebars$Utils.escapeExpression;
var isArray = _Handlebars$Utils.isArray;
var isObject = _Handlebars$Utils.isObject;
var insertAfter = _Handlebars$Utils.insertAfter;

var Binding = function () {
  function Binding(context, keypath, value, options) {
    _classCallCheck(this, Binding);

    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.id = uniqueId();
    this.value = value;
    this.context = context;
    this.keypath = keypath;
    this.options = options;
    if (keypath) this.value = (0, _utils.path)(this.context, this.keypath);
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

      Handlebars.registerAttribute(attributeName, function (node) {
        return null;
      }, {
        ready: function ready(node) {
          _this.setNode(node);
          _this.render({ initialize: true });
          _this.observe();
          delete attributes[attributeName];
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
      store.hold(this.id, flatten([this.node]));
      return new SafeString(this.createElement());
    }
  }, {
    key: "initializeBlock",
    value: function initializeBlock() {
      this.setMarker(document.createTextNode(""));
      this.setDelimiter(document.createTextNode(""));
      var nodes = this.render({ initialize: true });
      this.observe();
      store.hold(this.id, flatten([this.marker, nodes, this.delimiter]));
      return new SafeString(this.createElement());
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
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.options.hash.attr == true) {
        if (this.previousOutput != this.output) {
          this.node.removeAttribute(this.previousOutput);
          this.node.setAttribute(this.output, "");
        }
      } else if (this.options.hash.attr == "class") {
        (0, _utils.removeClass)(this.node, this.previousOutput);
        (0, _utils.addClass)(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }, {
    key: "renderInline",
    value: function renderInline() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (isString(this.output)) {
        this.node.textContent = escapeExpression(new SafeString(this.output));
      } else {
        this.node.textContent = escapeExpression(this.output);
      }
    }
  }, {
    key: "renderBlock",
    value: function renderBlock() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.initialize) {
        return Handlebars.parseHTML(this.output); // gambi
      } else {
          (0, _utils.removeBetween)(this.marker, this.delimiter).forEach(function (node) {
            return Handlebars.unbind(node);
          });
          insertAfter(this.marker, Handlebars.parseHTML(this.output));
        }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      if (isArray(this.value)) {
        this.setObserver(new ArrayObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else if (isObject(this.value)) {
        this.setObserver(new ObjectObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else {
        this.setObserver(new PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this2.value = value;
          _this2.render();
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

},{"./utils":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;
exports.unbind = unbind;
exports.update = update;
exports.register = register;

var _utils = require("./utils");

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

var _if_binding = require("./if_binding");

var _if_binding2 = _interopRequireDefault(_if_binding);

var _each_binding = require("./each_binding");

var _each_binding2 = _interopRequireDefault(_each_binding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Handlebars = Handlebars;
var helpers = _Handlebars.helpers;
var isString = Handlebars.Utils.isString;
function bind(root) {
  (0, _utils.traverse)(root, function (node) {
    if (node.binding) {
      node.binding.observe();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.observe();
      });
    }
  });
};

function unbind(root) {
  (0, _utils.traverse)(root, function (node) {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.stopObserving();
      });
    }
  });
};

function update() {
  Platform.performMicrotaskCheckpoint();
};

function register() {
  Handlebars.registerHelper('bind', function (keypath, options) {
    return new _binding2.default(this, keypath, null, options).initialize();
  });

  Handlebars.registerHelper('if', function (conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && isString(conditional)) {
      keypath = conditional;
      conditional = (0, _utils.path)(this, keypath);
    }

    return new _if_binding2.default(this, keypath, conditional, options).initialize();
  });

  Handlebars.registerHelper('each', function (items, options) {
    return new _each_binding2.default(this, null, items, options).initialize();
  });

  Handlebars.registerHelper("unless", function (conditional, options) {
    var fn = options.fn;
    var inverse = options.inverse;

    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return helpers.if.apply(this, [conditional, options]);
  });

  Handlebars.registerElement('binding', function (attributes) {
    return attributes.id;
  });
};

},{"./binding":2,"./each_binding":4,"./if_binding":5,"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Handlebars = Handlebars;
var store = _Handlebars.store;
var SafeString = _Handlebars.SafeString;
var _Handlebars$Utils = Handlebars.Utils;
var flatten = _Handlebars$Utils.flatten;
var isObject = _Handlebars$Utils.isObject;
var extend = _Handlebars$Utils.extend;
var insertAfter = _Handlebars$Utils.insertAfter;

var ItemBinding = function (_Binding) {
  _inherits(ItemBinding, _Binding);

  function ItemBinding() {
    _classCallCheck(this, ItemBinding);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ItemBinding).apply(this, arguments));
  }

  _createClass(ItemBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(ItemBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.options.hash.var) {
        this.context[this.options.hash.var] = this.value;
      } else if (isObject(this.value)) {
        extend(this.context, this.value);
      }

      return this.setOutput(this.options.fn(this.context));
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      this.parentContextObserver = new ObjectObserver(this.options.hash.parentContext);
      this.parentContextObserver.open(function () {
        extend(_this2.context, _this2.options.hash.parentContext);
      });

      if (isObject(this.value)) {
        if (!this.options.hash.var) {
          this.setObserver(new ObjectObserver(this.value));
          this.observer.open(function () {
            return extend(_this2.context, _this2.value);
          });
        }
      }
    }
  }]);

  return ItemBinding;
}(_binding2.default);

var EachBinding = function (_Binding2) {
  _inherits(EachBinding, _Binding2);

  function EachBinding(context, keypath, value, options) {
    _classCallCheck(this, EachBinding);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(EachBinding).call(this, context, keypath, value, options));

    _this3.itemBindings = [];
    _this3.empty = value.length == 0;
    _this3.options.hash.parentContext = _this3.context;
    return _this3;
  }

  _createClass(EachBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(EachBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this4 = this;

      this.setObserver(new ArrayObserver(this.value));
      this.observer.open(function (splices) {
        splices.forEach(function (splice) {
          _this4.empty = _this4.value.length == 0;
          _this4.render({ splice: splice });
        });

        _this4.value.forEach(function (item, index) {
          _this4.itemBindings[index].context.index = index;
        });
      });
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      var _this5 = this;

      var output = "";
      this.itemBindings = [];

      this.value.forEach(function (item, index) {
        var itemBinding = new ItemBinding(extend({ index: index, "$this": item }, _this5.context), null, item, _this5.options);
        _this5.itemBindings.push(itemBinding);
        output += itemBinding.initialize();
      });

      return this.setOutput(this.empty ? this.options.inverse(this.context) : output);
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.splice) {
        var splice = options.splice;

        if (splice.removed.length > 0) {
          var removedCount = 0;
          for (var index = splice.index; index < splice.index + splice.removed.length; index++) {
            this.removeItem(index - removedCount++);
          }
        }

        if (splice.addedCount > 0) {
          for (var _index = splice.index; _index < splice.index + splice.addedCount; _index++) {
            this.addItem(_index);
          }
        }
      } else {
        return _get(Object.getPrototypeOf(EachBinding.prototype), "render", this).call(this, options);
      }
    }
  }, {
    key: "addItem",
    value: function addItem(index) {
      var previous;

      if (this.itemBindings[index - 1]) {
        previous = this.itemBindings[index - 1].delimiter;
      } else {
        previous = this.marker;
      }

      var item = this.value[index];
      var itemBinding = new ItemBinding(extend({ index: index, "$this": item }, this.context), null, item, this.options);
      insertAfter(previous, Handlebars.parseHTML(itemBinding.initialize()));
      this.itemBindings.splice(index, 0, itemBinding);
    }
  }, {
    key: "removeItem",
    value: function removeItem(index) {
      var itemBinding = this.itemBindings[index];
      (0, _utils.removeBetween)(itemBinding.marker, itemBinding.delimiter).forEach(function (node) {
        return Handlebars.unbind(node);
      });
      itemBinding.marker.remove();
      itemBinding.delimiter.remove();
      this.itemBindings.splice(index, 1);
    }
  }]);

  return EachBinding;
}(_binding2.default);

exports.default = EachBinding;

},{"./binding":2,"./utils":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _binding = require('./binding');

var _binding2 = _interopRequireDefault(_binding);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isArray = Handlebars.Utils.isArray;

var IfBinding = function (_Binding) {
  _inherits(IfBinding, _Binding);

  function IfBinding(context, keypath, value, options) {
    _classCallCheck(this, IfBinding);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IfBinding).call(this, context, keypath, value, options));

    _this.falsy = (0, _utils.isFalsy)(value);
    return _this;
  }

  _createClass(IfBinding, [{
    key: 'initialize',
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(Object.getPrototypeOf(IfBinding.prototype), 'initialize', this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: 'observe',
    value: function observe() {
      var _this2 = this;

      if (isArray(this.value)) {
        this.setObserver(new ArrayObserver(this.value));
        this.observer.open(function () {
          if ((0, _utils.isFalsy)(_this2.value) != _this2.falsy) {
            _this2.falsy = (0, _utils.isFalsy)(_this2.value);
            _this2.render();
          }
        });
      } else {
        this.setObserver(new PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this2.value = value;
          if ((0, _utils.isFalsy)(_this2.value) != _this2.falsy) {
            _this2.falsy = (0, _utils.isFalsy)(_this2.value);
            _this2.render();
          }
        });
      }
    }
  }, {
    key: 'runOutput',
    value: function runOutput() {
      if (this.falsy) {
        return this.setOutput(this.options.inverse ? this.options.inverse(this.context) : this.options.hash.else);
      } else {
        return this.setOutput(this.options.fn ? this.options.fn(this.context) : this.options.hash.then);
      }
    }
  }, {
    key: 'renderAttribute',
    value: function renderAttribute() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.options.hash.attr == true) {
        this.node.removeAttribute(this.previousOutput);
        if (this.output) this.node.setAttribute(this.output, "");
      } else if (this.options.hash.attr == "class") {
        (0, _utils.removeClass)(this.node, this.previousOutput);
        (0, _utils.addClass)(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }]);

  return IfBinding;
}(_binding2.default);

exports.default = IfBinding;

},{"./binding":2,"./utils":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFalsy = isFalsy;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.nodesBetween = nodesBetween;
exports.removeBetween = removeBetween;
exports.traverse = traverse;
exports.path = path;
var isEmpty = Handlebars.Utils.isEmpty;
function isFalsy(object) {
  return !object || isEmpty(object);
};

function hasClass(node, value) {
  return node.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
};

function addClass(node, value) {
  if (!hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += ' ' + value;
    }
  }
};

function removeClass(node, value) {
  if (hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
  }
};

function nodesBetween(firstNode, lastNode) {
  var next = firstNode.nextSibling;
  var nodes = [];

  while (next && next != lastNode) {
    var sibling = next.nextSibling;
    nodes.push(next);
    next = sibling;
  }

  return nodes;
};

function removeBetween(firstNode, lastNode) {
  var nodes = nodesBetween(firstNode, lastNode);
  nodes.forEach(function (node) {
    return node.remove();
  });
  return nodes;
};

function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    traverse(node, callback);
    node = node.nextSibling;
  }
};

function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach(function (path) {
    return object = object[path];
  });
  return object;
};

},{}]},{},[1,2,3,4,5,6]);

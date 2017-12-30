// handlebars.binding
// ------------------
// v0.3.8
//
// Copyright (c) 2013-2017 Mateus Maso
// Distributed under MIT license
//
// 


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

    var _Handlebars$Utils = Handlebars.Utils,
        uniqueId = _Handlebars$Utils.uniqueId,
        path = _Handlebars$Utils.path;


    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.Handlebars = Handlebars;
    this.id = uniqueId();
    this.value = value;
    this.context = context;
    this.keypath = keypath;
    this.options = options;
    if (keypath) this.value = path(this.context, this.keypath);
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
      var store = this.Handlebars.store;
      var flatten = this.Handlebars.Utils.flatten;

      this.setNode(document.createTextNode(""));
      this.render({ initialize: true });
      this.observe();
      store.hold(this.id, flatten([this.node]));
      return new this.Handlebars.SafeString(this.createElement());
    }
  }, {
    key: "initializeBlock",
    value: function initializeBlock() {
      var store = this.Handlebars.store;
      var flatten = this.Handlebars.Utils.flatten;

      this.setMarker(document.createTextNode(""));
      this.setDelimiter(document.createTextNode(""));
      var nodes = this.render({ initialize: true });
      this.observe();
      store.hold(this.id, flatten([this.marker, nodes, this.delimiter]));
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
      var _Handlebars$Utils2 = this.Handlebars.Utils,
          removeClass = _Handlebars$Utils2.removeClass,
          addClass = _Handlebars$Utils2.addClass;


      if (this.options.hash.attr == true) {
        if (this.previousOutput != this.output) {
          this.node.removeAttribute(this.previousOutput);
          this.node.setAttribute(this.output, "");
        }
      } else if (this.options.hash.attr == "class") {
        removeClass(this.node, this.previousOutput);
        addClass(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }, {
    key: "renderInline",
    value: function renderInline() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _Handlebars$Utils3 = this.Handlebars.Utils,
          isString = _Handlebars$Utils3.isString,
          escapeExpression = _Handlebars$Utils3.escapeExpression;


      if (isString(this.output)) {
        this.node.textContent = escapeExpression(new this.Handlebars.SafeString(this.output));
      } else {
        this.node.textContent = escapeExpression(this.output);
      }
    }
  }, {
    key: "renderBlock",
    value: function renderBlock() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _Handlebars = this.Handlebars,
          parseHTML = _Handlebars.parseHTML,
          unbind = _Handlebars.unbind;
      var _Handlebars$Utils4 = this.Handlebars.Utils,
          removeBetween = _Handlebars$Utils4.removeBetween,
          insertAfter = _Handlebars$Utils4.insertAfter;


      if (options.initialize) {
        return parseHTML(this.output); // gambi
      } else {
        removeBetween(this.marker, this.delimiter).forEach(function (node) {
          return unbind(node);
        });
        insertAfter(this.marker, parseHTML(this.output));
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      var _Handlebars$Utils5 = this.Handlebars.Utils,
          isArray = _Handlebars$Utils5.isArray,
          isObject = _Handlebars$Utils5.isObject;


      if (isArray(this.value)) {
        this.setObserver(new _observeJs.ArrayObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else if (isObject(this.value)) {
        this.setObserver(new _observeJs.ObjectObserver(this.value));
        this.observer.open(function () {
          return _this2.render();
        });
      } else {
        this.setObserver(new _observeJs.PathObserver(this.context, this.keypath));
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

},{"observe-js":21}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemBinding = function (_Binding) {
  _inherits(ItemBinding, _Binding);

  function ItemBinding() {
    _classCallCheck(this, ItemBinding);

    return _possibleConstructorReturn(this, (ItemBinding.__proto__ || Object.getPrototypeOf(ItemBinding)).apply(this, arguments));
  }

  _createClass(ItemBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(ItemBinding.prototype.__proto__ || Object.getPrototypeOf(ItemBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      var _Handlebars$Utils = this.Handlebars.Utils,
          isObject = _Handlebars$Utils.isObject,
          extend = _Handlebars$Utils.extend;


      if (this.options.hash.var) {
        this.context[this.options.hash.var] = this.value;
      } else if (isObject(this.value)) {
        _extends(this.context, this.value);
      }

      return this.setOutput(this.options.fn(this.context));
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      var _Handlebars$Utils2 = this.Handlebars.Utils,
          isObject = _Handlebars$Utils2.isObject,
          extend = _Handlebars$Utils2.extend;


      this.parentContextObserver = new _observeJs.ObjectObserver(this.options.hash.parentContext);
      this.parentContextObserver.open(function () {
        var noConflictParentContext = {};

        Object.keys(_this2.options.hash.parentContext).forEach(function (key) {
          if (!_this2.context["$this"].hasOwnProperty(key) && key != "index") {
            noConflictParentContext[key] = _this2.options.hash.parentContext[key];
          }
        });

        _extends(_this2.context, noConflictParentContext);
      });

      if (isObject(this.value)) {
        if (!this.options.hash.var) {
          this.setObserver(new _observeJs.ObjectObserver(this.value));
          this.observer.open(function () {
            return _extends(_this2.context, _this2.value);
          });
        }
      }
    }
  }]);

  return ItemBinding;
}(_binding2.default);

var EachBinding = function (_Binding2) {
  _inherits(EachBinding, _Binding2);

  function EachBinding(Handlebars, context, keypath, value, options) {
    _classCallCheck(this, EachBinding);

    var _this3 = _possibleConstructorReturn(this, (EachBinding.__proto__ || Object.getPrototypeOf(EachBinding)).call(this, Handlebars, context, keypath, value, options));

    _this3.itemBindings = [];
    _this3.empty = value.length == 0;
    _this3.options.hash.parentContext = _this3.context;
    return _this3;
  }

  _createClass(EachBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(EachBinding.prototype.__proto__ || Object.getPrototypeOf(EachBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this4 = this;

      this.setObserver(new _observeJs.ArrayObserver(this.value));
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

      var extend = this.Handlebars.Utils.extend;

      var output = "";
      this.itemBindings = [];

      this.value.forEach(function (item, index) {
        var itemContext = _extends({}, _this5.context, { index: index, "$this": item });
        var itemBinding = new ItemBinding(_this5.Handlebars, itemContext, null, item, _this5.options);
        _this5.itemBindings.push(itemBinding);
        output += itemBinding.initialize();
      });

      return this.setOutput(this.empty ? this.options.inverse(this.context) : output);
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
        return _get(EachBinding.prototype.__proto__ || Object.getPrototypeOf(EachBinding.prototype), "render", this).call(this, options);
      }
    }
  }, {
    key: "addItem",
    value: function addItem(index) {
      var parseHTML = this.Handlebars.parseHTML;
      var _Handlebars$Utils3 = this.Handlebars.Utils,
          extend = _Handlebars$Utils3.extend,
          insertAfter = _Handlebars$Utils3.insertAfter;

      var previous;

      if (this.itemBindings[index - 1]) {
        previous = this.itemBindings[index - 1].delimiter;
      } else {
        previous = this.marker;
      }

      var item = this.value[index];
      var itemContext = _extends({}, this.context, { index: index, "$this": item });
      var itemBinding = new ItemBinding(this.Handlebars, itemContext, null, item, this.options);
      insertAfter(previous, parseHTML(itemBinding.initialize()));
      this.itemBindings.splice(index, 0, itemBinding);
    }
  }, {
    key: "removeItem",
    value: function removeItem(index) {
      var unbind = this.Handlebars.unbind;
      var removeBetween = this.Handlebars.Utils.removeBetween;

      var itemBinding = this.itemBindings[index];
      removeBetween(itemBinding.marker, itemBinding.delimiter).forEach(function (node) {
        return unbind(node);
      });
      itemBinding.marker.remove();
      itemBinding.delimiter.remove();
      this.itemBindings.splice(index, 1);
    }
  }]);

  return EachBinding;
}(_binding2.default);

exports.default = EachBinding;

},{"./binding":4,"observe-js":21}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _binding = require("./binding");

var _binding2 = _interopRequireDefault(_binding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IfBinding = function (_Binding) {
  _inherits(IfBinding, _Binding);

  function IfBinding(Handlebars, context, keypath, value, options) {
    _classCallCheck(this, IfBinding);

    var isFalsy = Handlebars.Utils.isFalsy;

    var _this = _possibleConstructorReturn(this, (IfBinding.__proto__ || Object.getPrototypeOf(IfBinding)).call(this, Handlebars, context, keypath, value, options));

    _this.falsy = isFalsy(value);
    return _this;
  }

  _createClass(IfBinding, [{
    key: "initialize",
    value: function initialize() {
      if (this.options.hash.bind) {
        return _get(IfBinding.prototype.__proto__ || Object.getPrototypeOf(IfBinding.prototype), "initialize", this).call(this);
      } else {
        return this.runOutput();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      var _this2 = this;

      var _Handlebars$Utils = this.Handlebars.Utils,
          isArray = _Handlebars$Utils.isArray,
          isFalsy = _Handlebars$Utils.isFalsy;


      if (isArray(this.value)) {
        this.setObserver(new _observeJs.ArrayObserver(this.value));
        this.observer.open(function () {
          if (isFalsy(_this2.value) != _this2.falsy) {
            _this2.falsy = isFalsy(_this2.value);
            _this2.render();
          }
        });
      } else {
        this.setObserver(new _observeJs.PathObserver(this.context, this.keypath));
        this.observer.open(function (value) {
          _this2.value = value;
          if (isFalsy(_this2.value) != _this2.falsy) {
            _this2.falsy = isFalsy(_this2.value);
            _this2.render();
          }
        });
      }
    }
  }, {
    key: "runOutput",
    value: function runOutput() {
      if (this.falsy) {
        return this.setOutput(this.options.inverse ? this.options.inverse(this.context) : this.options.hash.else);
      } else {
        return this.setOutput(this.options.fn ? this.options.fn(this.context) : this.options.hash.then);
      }
    }
  }, {
    key: "renderAttribute",
    value: function renderAttribute() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _Handlebars$Utils2 = this.Handlebars.Utils,
          removeClass = _Handlebars$Utils2.removeClass,
          addClass = _Handlebars$Utils2.addClass;


      if (this.options.hash.attr == true) {
        this.node.removeAttribute(this.previousOutput);
        if (this.output) this.node.setAttribute(this.output, "");
      } else if (this.options.hash.attr == "class") {
        removeClass(this.node, this.previousOutput);
        addClass(this.node, this.output);
      } else {
        this.node.setAttribute(this.options.hash.attr, this.output);
      }
    }
  }]);

  return IfBinding;
}(_binding2.default);

exports.default = IfBinding;

},{"./binding":4,"observe-js":21}],4:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1,"observe-js":21}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EachBinding = exports.IfBinding = exports.Binding = undefined;

var _Binding = require('./Binding');

var _Binding2 = _interopRequireDefault(_Binding);

var _IfBinding = require('./IfBinding');

var _IfBinding2 = _interopRequireDefault(_IfBinding);

var _EachBinding = require('./EachBinding');

var _EachBinding2 = _interopRequireDefault(_EachBinding);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Binding = _Binding2.default;
exports.IfBinding = _IfBinding2.default;
exports.EachBinding = _EachBinding2.default;

},{"./Binding":1,"./EachBinding":2,"./IfBinding":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;
function bind(root) {
  this.Utils.traverse(root, function (node) {
    if (node.binding) {
      node.binding.observe();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.observe();
      });
    }
  });
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBindingHelpers = exports.update = exports.unbind = exports.bind = undefined;

var _bind = require('./bind');

var _bind2 = _interopRequireDefault(_bind);

var _unbind = require('./unbind');

var _unbind2 = _interopRequireDefault(_unbind);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _registerBindingHelpers = require('./registerBindingHelpers');

var _registerBindingHelpers2 = _interopRequireDefault(_registerBindingHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.bind = _bind2.default;
exports.unbind = _unbind2.default;
exports.update = _update2.default;
exports.registerBindingHelpers = _registerBindingHelpers2.default;

},{"./bind":6,"./registerBindingHelpers":8,"./unbind":9,"./update":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerBindingHelpers;

var _bindings = require('../bindings');

function registerBindingHelpers() {
  var Handlebars = this;
  var _Utils = this.Utils,
      path = _Utils.path,
      isString = _Utils.isString;


  this.registerHelper('bind', function (keypath, options) {
    return new _bindings.Binding(Handlebars, this, keypath, null, options).initialize();
  });

  this.registerHelper('if', function (conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && isString(conditional)) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    return new _bindings.IfBinding(Handlebars, this, keypath, conditional, options).initialize();
  });

  this.registerHelper('each', function (items, options) {
    return new _bindings.EachBinding(Handlebars, this, null, items, options).initialize();
  });

  this.registerHelper("unless", function (conditional, options) {
    var fn = options.fn,
        inverse = options.inverse;

    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return Handlebars.helpers.if.apply(this, [conditional, options]);
  });

  this.registerElement('binding', function (attributes) {
    return attributes.id;
  });
};

},{"../bindings":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unbind;
function unbind(root) {
  this.Utils.traverse(root, function (node) {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.stopObserving();
      });
    }
  });
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;

var _observeJs = require("observe-js");

var _observeJs2 = _interopRequireDefault(_observeJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function update() {
  Platform.performMicrotaskCheckpoint();
};

},{"observe-js":21}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = HandlebarsBinding;

var _handlebars = require("handlebars.element");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _bindings = require("./bindings");

var _core = require("./core");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bindAll(object, parent) {
  Object.keys(object).forEach(function (key) {
    if (typeof object[key] === "function") {
      object[key] = object[key].bind(parent);
    }
  });

  return object;
};

function HandlebarsBinding(Handlebars) {
  (0, _handlebars2.default)(Handlebars);

  _extends(Handlebars, bindAll({
    Binding: _bindings.Binding,
    IfBinding: _bindings.IfBinding,
    EachBinding: _bindings.EachBinding,
    bind: _core.bind,
    unbind: _core.unbind,
    update: _core.update,
    registerBindingHelpers: _core.registerBindingHelpers
  }, Handlebars));

  _extends(Handlebars.Utils, bindAll({
    path: _utils.path,
    traverse: _utils.traverse,
    removeBetween: _utils.removeBetween,
    nodesBetween: _utils.nodesBetween,
    removeClass: _utils.removeClass,
    addClass: _utils.addClass,
    hasClass: _utils.hasClass,
    isFalsy: _utils.isFalsy
  }, Handlebars.Utils));

  Handlebars.registerBindingHelpers();

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding(window.Handlebars);
}

},{"./bindings":5,"./core":7,"./utils":14,"handlebars.element":28}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addClass;
function addClass(node, value) {
  if (!this.hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += " " + value;
    }
  }
}

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasClass;
function hasClass(node, value) {
  return node.className.match(new RegExp("(\\s|^)" + value + "(\\s|$)"));
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFalsy = exports.hasClass = exports.addClass = exports.removeClass = exports.nodesBetween = exports.removeBetween = exports.traverse = exports.path = undefined;

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _removeBetween = require('./removeBetween');

var _removeBetween2 = _interopRequireDefault(_removeBetween);

var _nodesBetween = require('./nodesBetween');

var _nodesBetween2 = _interopRequireDefault(_nodesBetween);

var _removeClass = require('./removeClass');

var _removeClass2 = _interopRequireDefault(_removeClass);

var _addClass = require('./addClass');

var _addClass2 = _interopRequireDefault(_addClass);

var _hasClass = require('./hasClass');

var _hasClass2 = _interopRequireDefault(_hasClass);

var _isFalsy = require('./isFalsy');

var _isFalsy2 = _interopRequireDefault(_isFalsy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.path = _path2.default;
exports.traverse = _traverse2.default;
exports.removeBetween = _removeBetween2.default;
exports.nodesBetween = _nodesBetween2.default;
exports.removeClass = _removeClass2.default;
exports.addClass = _addClass2.default;
exports.hasClass = _hasClass2.default;
exports.isFalsy = _isFalsy2.default;

},{"./addClass":12,"./hasClass":13,"./isFalsy":15,"./nodesBetween":16,"./path":17,"./removeBetween":18,"./removeClass":19,"./traverse":20}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFalsy;
function isFalsy(object) {
  return !object || this.isEmpty(object);
}

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodesBetween;
function nodesBetween(firstNode, lastNode) {
  var next = firstNode.nextSibling;
  var nodes = [];

  while (next && next != lastNode) {
    var sibling = next.nextSibling;
    nodes.push(next);
    next = sibling;
  }

  return nodes;
}

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = path;
function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach(function (path) {
    return object = object[path];
  });
  return object;
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeBetween;
function removeBetween(firstNode, lastNode) {
  var nodes = this.nodesBetween(firstNode, lastNode);
  nodes.forEach(function (node) {
    return node.remove();
  });
  return nodes;
}

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeClass;
function removeClass(node, value) {
  if (this.hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
  }
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traverse;
function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    this.traverse(node, callback);
    node = node.nextSibling;
  }
}

},{}],21:[function(require,module,exports){
(function (global){
/*
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {
    if (typeof Object.observe !== 'function' ||
        typeof Array.observe !== 'function') {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    var arr = [];
    Object.observe(test, callback);
    Array.observe(arr, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 5)
      return false;

    if (records[0].type != 'add' ||
        records[1].type != 'update' ||
        records[2].type != 'delete' ||
        records[3].type != 'splice' ||
        records[4].type != 'splice') {
      return false;
    }

    Object.unobserve(test, callback);
    Array.unobserve(arr, callback);

    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (typeof navigator != 'undefined' && navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0 && s !== '';
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  };

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  };

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar;
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, defaultValue) {
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (obj == null || !(key in obj))
          return defaultValue;
        obj = obj[key];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[i]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n    ' + pathString + ' != null';
      }

      key = this[i];
      var keyIsIdent = isIdent(key);
      var keyForInOperator = keyIsIdent ? '"' + key.replace(/"/g, '\\"') + '"' : key;
      str += ' &&\n    ' + keyForInOperator + ' in ' + pathString + ')\n';
      pathString += keyIsIdent ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return defaultValue;';
      return new Function('obj', 'defaultValue', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};
    var prop;

    for (prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    return function(fn) {
      return Promise.resolve().then(fn);
    };
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var i, observer;
      for (i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      objects: objects,
      get rootObject() { return rootObj; },
      set rootObject(value) {
        rootObj = value;
        rootObjProps = {};
      },
      open: function(obs, object) {
        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
        if (lastObservedSet === this)
          lastObservedSet = null;
      },
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.rootObject !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.rootObject = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  };

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        this.directObserver_ = getObservedObject(this, this.value_,
                                                 this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      }
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path, defaultValue) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.defaultValue_ = defaultValue;
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_, this.defaultValue_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i];
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i];
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe);
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  };

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    var prop;
    for (prop in added)
      added[prop] = object[prop];

    for (prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      var i, j;

      // "Addition" rows. Initialize null column.
      for (i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (i = 1; i < rowCount; i++) {
        for (j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      var splice;
      if (currentStart == currentEnd) {
        splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return;
      }

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  // Export the observe-js object for **Node.js**, with backwards-compatibility
  // for the old `require()` API. Also ensure `exports` is not a DOM Element.
  // If we're in the browser, export as a global object.

  var expose = global;

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports;
    }
    expose = exports;
  }

  expose.Observer = Observer;
  expose.Observer.runEOM_ = runEOM;
  expose.Observer.observerSentinel_ = observerSentinel; // for testing.
  expose.Observer.hasObjectObserve = hasObserve;
  expose.ArrayObserver = ArrayObserver;
  expose.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  expose.ArraySplice = ArraySplice;
  expose.ObjectObserver = ObjectObserver;
  expose.PathObserver = PathObserver;
  expose.CompoundObserver = CompoundObserver;
  expose.Path = Path;
  expose.ObserverTransform = ObserverTransform;

})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseValue = exports.parseHTML = exports.registerAttribute = exports.registerElement = exports.attributes = exports.elements = exports.store = undefined;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _parseHTML = require('./parseHTML');

var _parseHTML2 = _interopRequireDefault(_parseHTML);

var _parseValue = require('./parseValue');

var _parseValue2 = _interopRequireDefault(_parseValue);

var _registerElement = require('./registerElement');

var _registerElement2 = _interopRequireDefault(_registerElement);

var _registerAttribute = require('./registerAttribute');

var _registerAttribute2 = _interopRequireDefault(_registerAttribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var elements = {};
var attributes = {};

exports.store = _store2.default;
exports.elements = elements;
exports.attributes = attributes;
exports.registerElement = _registerElement2.default;
exports.registerAttribute = _registerAttribute2.default;
exports.parseHTML = _parseHTML2.default;
exports.parseValue = _parseValue2.default;

},{"./parseHTML":23,"./parseValue":24,"./registerAttribute":25,"./registerElement":26,"./store":27}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseHTML;
function parseHTML(html) {
  var _Utils = this.Utils,
      isString = _Utils.isString,
      flatten = _Utils.flatten,
      camelize = _Utils.camelize,
      replaceWith = _Utils.replaceWith;

  var bindings = [];

  if (html instanceof this.SafeString) {
    html = html.toString();
  }

  if (isString(html)) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    var rootNodes = div.childNodes;
  } else {
    var rootNodes = html;
  }

  var nodes = flatten(rootNodes);

  while (nodes.length != 0) {
    var nextNodes = [];

    for (var index = 0; index < nodes.length; index++) {
      var binding = { owner: nodes[index], element: undefined, attributes: [] };
      var childNodes = flatten(nodes[index].childNodes);

      for (var bIndex = 0; bIndex < childNodes.length; bIndex++) {
        nextNodes.push(childNodes[bIndex]);
      }

      if (nodes[index].attributes) {
        for (var bIndex = 0; bIndex < nodes[index].attributes.length; bIndex++) {
          if (/hb-/i.test(nodes[index].attributes[bIndex].name)) {
            binding.attributes.push(nodes[index].attributes[bIndex]);
          }
        }
      }

      if (/^hb-/i.test(nodes[index].nodeName)) {
        binding.element = nodes[index];
      }

      if (binding.element || binding.attributes.length > 0) {
        bindings.unshift(binding);
      }
    }

    nodes = nextNodes;
  }

  for (var index = 0; index < bindings.length; index++) {
    var bindingOwner = bindings[index].owner;
    var bindingElement = bindings[index].element;
    var bindingAttributes = bindings[index].attributes;

    if (bindingAttributes.length > 0) {
      for (var bIndex = 0; bIndex < bindingAttributes.length; bIndex++) {
        var bindingAttribute = bindingAttributes[bIndex];
        var bindingAttributeName = bindingAttribute.name.replace("hb-", "");
        var bindingAttributeFn = this.attributes[bindingAttributeName];
        var newAttribute = bindingAttributeFn.apply(bindingAttribute, [bindingOwner]);

        if (newAttribute) {
          bindingOwner.setAttributeNode(newAttribute);
        }

        bindingOwner.removeAttributeNode(bindingAttribute);

        if (bindingAttributeFn.options.ready && !/hb-/i.test(bindingOwner.tagName.toLowerCase())) {
          bindingAttributeFn.options.ready.apply(bindingAttribute, [bindingOwner]);
        }
      }
    }

    if (bindingElement) {
      var bindingElementAttributes = {};
      var bindingElementName = bindingElement.tagName.toLowerCase().replace("hb-", "");
      var bindingElementFn = this.elements[bindingElementName];

      for (var bIndex = 0; bIndex < bindingElement.attributes.length; bIndex++) {
        var bindingAttribute = bindingElement.attributes.item(bIndex);
        var bindingAttributeName = camelize(bindingAttribute.nodeName);
        var bool = bindingElementFn.options.booleans && bindingElementFn.options.booleans.indexOf(bindingAttributeName) >= 0;

        bindingElementAttributes[bindingAttributeName] = this.parseValue(bindingAttribute.nodeValue, bool);
      }

      var newElement = bindingElementFn.apply(bindingElement, [bindingElementAttributes]);
      replaceWith(bindingElement, newElement);

      for (var bIndex = 0; bIndex < bindingAttributes.length; bIndex++) {
        var bindingAttribute = bindingAttributes[bIndex];
        var bindingAttributeName = bindingAttribute.name.replace("hb-", "");
        var bindingAttributeFn = this.attributes[bindingAttributeName];

        if (bindingAttributeFn.options.ready) {
          bindingAttributeFn.options.ready.apply(bindingAttribute, [newElement]);
        }
      }
    }
  }

  return flatten(rootNodes);
};

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseValue;
function parseValue(value, bool) {
  var object = this.store[value];

  if (object) {
    value = object;
  } else if (value == "true") {
    value = true;
  } else if (value == "false") {
    value = false;
  } else if (value == "null") {
    value = undefined;
  } else if (value == "undefined") {
    value = undefined;
  } else if (!isNaN(value) && value != "") {
    value = parseFloat(value);
  }

  return bool ? value || value === "" ? true : false : value === "" ? undefined : value;
}

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerAttribute;
function registerAttribute(name, fn, options) {
  fn.options = options || {};
  this.attributes[name] = fn;
}

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerElement;
function registerElement(name, fn, options) {
  fn.options = options || {};
  this.elements[name] = fn;
}

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var store = {};

function hold(key, value) {
  return this[key] = value;
}

function release(key) {
  var value = this[key];
  delete this[key];
  return value;
}

function keyFor(value) {
  for (var key in this) {
    if (this[key] == value) {
      return key;
    }
  }
}

_extends(store, { hold: hold, release: release, keyFor: keyFor });

exports.default = store;

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = HandlebarsElement;

var _utils = require('./utils');

var _core = require('./core');

function bindAll(object, parent) {
  Object.keys(object).forEach(function (key) {
    if (typeof object[key] === "function") {
      object[key] = object[key].bind(parent);
    }
  });

  return object;
};

function extendEscapeExpression(Handlebars) {
  var _escapeExpression;

  if (Handlebars.Utils._escapeExpression) {
    _escapeExpression = Handlebars.Utils._escapeExpression;
  } else {
    _escapeExpression = Handlebars.Utils.escapeExpression;
  }

  return {
    _escapeExpression: _escapeExpression,
    escapeExpression: function escapeExpression(value) {
      return _utils.escapeExpression.apply(Handlebars.Utils, [value, Handlebars.store]);
    }
  };
};

function HandlebarsElement(Handlebars) {
  _extends(Handlebars, bindAll({
    store: _core.store,
    elements: _core.elements,
    attributes: _core.attributes,
    registerElement: _core.registerElement,
    registerAttribute: _core.registerAttribute,
    parseValue: _core.parseValue,
    parseHTML: _core.parseHTML
  }, Handlebars));

  _extends(Handlebars.Utils, bindAll(_extends({
    isObject: _utils.isObject,
    isString: _utils.isString,
    uniqueId: _utils.uniqueId,
    flatten: _utils.flatten,
    camelize: _utils.camelize,
    replaceWith: _utils.replaceWith,
    insertAfter: _utils.insertAfter
  }, extendEscapeExpression(Handlebars)), Handlebars.Utils));

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsElement(window.Handlebars);
}

},{"./core":22,"./utils":32}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = camelize;
function camelize(string) {
  return string.trim().replace(/[-_\s]+(.)?/g, function (match, word) {
    return word ? word.toUpperCase() : "";
  });
}

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escapeExpression;
function escapeExpression(value, store) {
  if (this.isObject(value) && !value.toHTML) {
    var id = store.keyFor(value);

    if (id) {
      value = id;
    } else {
      id = this.uniqueId();
      store.hold(id, value);
      value = id;
    }
  } else if (value === false) {
    value = value.toString();
  }

  return this._escapeExpression(value);
}

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;
function flatten(array, flattenArray) {
  flattenArray = flattenArray || [];

  for (var index = 0; index < array.length; index++) {
    if (this.isArray(array[index])) {
      this.flatten(array[index], flattenArray);
    } else {
      flattenArray.push(array[index]);
    }
  };

  return flattenArray;
}

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeExpression = exports.insertAfter = exports.replaceWith = exports.camelize = exports.flatten = exports.uniqueId = exports.isString = exports.isObject = undefined;

var _isObject = require('./isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isString = require('./isString');

var _isString2 = _interopRequireDefault(_isString);

var _uniqueId = require('./uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _flatten = require('./flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);

var _replaceWith = require('./replaceWith');

var _replaceWith2 = _interopRequireDefault(_replaceWith);

var _insertAfter = require('./insertAfter');

var _insertAfter2 = _interopRequireDefault(_insertAfter);

var _escapeExpression = require('./escapeExpression');

var _escapeExpression2 = _interopRequireDefault(_escapeExpression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.isObject = _isObject2.default;
exports.isString = _isString2.default;
exports.uniqueId = _uniqueId2.default;
exports.flatten = _flatten2.default;
exports.camelize = _camelize2.default;
exports.replaceWith = _replaceWith2.default;
exports.insertAfter = _insertAfter2.default;
exports.escapeExpression = _escapeExpression2.default;

},{"./camelize":29,"./escapeExpression":30,"./flatten":31,"./insertAfter":33,"./isObject":34,"./isString":35,"./replaceWith":36,"./uniqueId":37}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertAfter;
function insertAfter(node, nodes) {
  nodes = this.isArray(nodes) ? nodes.slice() : [nodes];
  nodes.unshift(node);

  for (var index = 1; index < nodes.length; index++) {
    if (nodes[index - 1].nextSibling) {
      nodes[index - 1].parentNode.insertBefore(nodes[index], nodes[index - 1].nextSibling);
    } else {
      nodes[index - 1].parentNode.appendChild(nodes[index]);
    }
  }
}

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;
function isObject(object) {
  return object === Object(object);
}

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isString;
function isString(object) {
  return typeof object === 'string' || object instanceof String;
}

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceWith;
function replaceWith(node, nodes) {
  nodes = this.isArray(nodes) ? nodes : [nodes];

  for (var index = 0; index < nodes.length; index++) {
    if (index == 0) {
      node.parentNode.replaceChild(nodes[index], node);
    } else {
      this.insertAfter(nodes[index - 1], nodes[index]);
    }
  }
}

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uniqueId;
function uniqueId() {
  var generate = function generate(bool) {
    var random = (Math.random().toString(16) + "000000000").substr(2, 8);
    return bool ? "-" + random.substr(0, 4) + "-" + random.substr(4, 4) : random;
  };

  return generate() + generate(true) + generate(true) + generate();
}

},{}]},{},[11]);

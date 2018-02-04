// handlebars.binding
// ------------------
// v0.4.0
//
// Copyright (c) 2013-2018 Mateus Maso
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

},{"observe-js":20}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _Binding3 = require("./Binding");

var _Binding4 = _interopRequireDefault(_Binding3);

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
}(_Binding4.default);

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
}(_Binding4.default);

exports.default = EachBinding;

},{"./Binding":1,"observe-js":20}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _observeJs = require("observe-js");

var _Binding2 = require("./Binding");

var _Binding3 = _interopRequireDefault(_Binding2);

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
}(_Binding3.default);

exports.default = IfBinding;

},{"./Binding":1,"observe-js":20}],4:[function(require,module,exports){
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

},{"./Binding":1,"./EachBinding":2,"./IfBinding":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./bind":5,"./registerBindingHelpers":7,"./unbind":8,"./update":9}],7:[function(require,module,exports){
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

},{"../bindings":4}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"observe-js":20}],10:[function(require,module,exports){
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

},{"./bindings":4,"./core":6,"./utils":13,"handlebars.element":27}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasClass;
function hasClass(node, value) {
  return node.className.match(new RegExp("(\\s|^)" + value + "(\\s|$)"));
}

},{}],13:[function(require,module,exports){
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

},{"./addClass":11,"./hasClass":12,"./isFalsy":14,"./nodesBetween":15,"./path":16,"./removeBetween":17,"./removeClass":18,"./traverse":19}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFalsy;
function isFalsy(object) {
  return !object || this.isEmpty(object);
}

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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

},{"./parseHTML":22,"./parseValue":23,"./registerAttribute":24,"./registerElement":25,"./store":26}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseHTML;

var _simpleDom = require('simple-dom');

var _simpleHtmlTokenizer = require('simple-html-tokenizer');

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
    var parser = new _simpleDom.HTMLParser(_simpleHtmlTokenizer.tokenize, document, _simpleDom.voidMap);
    var fragment = parser.parse(html.trim());
    var rootNodes = fragment.childNodes;
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

},{"simple-dom":37,"simple-html-tokenizer":38}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerAttribute;
function registerAttribute(name, fn, options) {
  fn.options = options || {};
  this.attributes[name] = fn;
}

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerElement;
function registerElement(name, fn, options) {
  fn.options = options || {};
  this.elements[name] = fn;
}

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./core":21,"./utils":31}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"./camelize":28,"./escapeExpression":29,"./flatten":30,"./insertAfter":32,"./isObject":33,"./isString":34,"./replaceWith":35,"./uniqueId":36}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;
function isObject(object) {
  return object === Object(object);
}

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isString;
function isString(object) {
  return typeof object === 'string' || object instanceof String;
}

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.SimpleDOM = {})));
}(this, (function (exports) { 'use strict';

var Node = function Node(nodeType, nodeName, nodeValue) {
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
    this.parentNode = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.firstChild = null;
    this.lastChild = null;
    this._childNodes = undefined;
};

var prototypeAccessors = { childNodes: { configurable: true } };
prototypeAccessors.childNodes.get = function () {
    var children = this._childNodes;
    if (children === undefined) {
        children = this._childNodes = new ChildNodes(this);
    }
    return children;
};
Node.prototype.cloneNode = function cloneNode (deep) {
    var node = this._cloneNode();
    if (deep === true) {
        var child = this.firstChild;
        var nextChild = child;
        while (child !== null) {
            nextChild = child.nextSibling;
            node.appendChild(child.cloneNode(true));
            child = nextChild;
        }
    }
    return node;
};
Node.prototype.appendChild = function appendChild (newChild) {
    if (newChild.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
        insertFragment(newChild, this, this.lastChild, null);
        return newChild;
    }
    if (newChild.parentNode) {
        newChild.parentNode.removeChild(newChild);
    }
    newChild.parentNode = this;
    var refNode = this.lastChild;
    if (refNode === null) {
        this.firstChild = newChild;
        this.lastChild = newChild;
    }
    else {
        newChild.previousSibling = refNode;
        refNode.nextSibling = newChild;
        this.lastChild = newChild;
    }
    return newChild;
};
Node.prototype.insertBefore = function insertBefore (newChild, refChild) {
    if (refChild == null) {
        return this.appendChild(newChild);
    }
    if (newChild.nodeType === 11 /* DOCUMENT_FRAGMENT_NODE */) {
        insertFragment(newChild, this, refChild ? refChild.previousSibling : null, refChild);
        return newChild;
    }
    if (newChild.parentNode) {
        newChild.parentNode.removeChild(newChild);
    }
    newChild.parentNode = this;
    var previousSibling = refChild.previousSibling;
    if (previousSibling) {
        previousSibling.nextSibling = newChild;
        newChild.previousSibling = previousSibling;
    }
    else {
        newChild.previousSibling = null;
    }
    refChild.previousSibling = newChild;
    newChild.nextSibling = refChild;
    if (this.firstChild === refChild) {
        this.firstChild = newChild;
    }
    return newChild;
};
Node.prototype.removeChild = function removeChild (oldChild) {
    if (this.firstChild === oldChild) {
        this.firstChild = oldChild.nextSibling;
    }
    if (this.lastChild === oldChild) {
        this.lastChild = oldChild.previousSibling;
    }
    if (oldChild.previousSibling) {
        oldChild.previousSibling.nextSibling = oldChild.nextSibling;
    }
    if (oldChild.nextSibling) {
        oldChild.nextSibling.previousSibling = oldChild.previousSibling;
    }
    oldChild.parentNode = null;
    oldChild.nextSibling = null;
    oldChild.previousSibling = null;
    return oldChild;
};
Node.prototype._cloneNode = function _cloneNode () {
    return new Node(this.nodeType, this.nodeName, this.nodeValue);
};

Object.defineProperties( Node.prototype, prototypeAccessors );

Node.ELEMENT_NODE = 1 /* ELEMENT_NODE */;
Node.TEXT_NODE = 3 /* TEXT_NODE */;
Node.COMMENT_NODE = 8 /* COMMENT_NODE */;
Node.DOCUMENT_NODE = 9 /* DOCUMENT_NODE */;
Node.DOCUMENT_FRAGMENT_NODE = 11 /* DOCUMENT_FRAGMENT_NODE */;
function insertFragment(fragment, newParent, before, after) {
    if (!fragment.firstChild) {
        return;
    }
    var firstChild = fragment.firstChild;
    var lastChild = firstChild;
    var node = firstChild;
    firstChild.previousSibling = before;
    if (before) {
        before.nextSibling = firstChild;
    }
    else {
        newParent.firstChild = firstChild;
    }
    while (node) {
        node.parentNode = newParent;
        lastChild = node;
        node = node.nextSibling;
    }
    lastChild.nextSibling = after;
    if (after) {
        after.previousSibling = lastChild;
    }
    else {
        newParent.lastChild = lastChild;
    }
}
var ChildNodes = function ChildNodes(node) {
    this.node = node;
};
ChildNodes.prototype.item = function item (index) {
    var child = this.node.firstChild;
    for (var i = 0; child && index !== i; i++) {
        child = child.nextSibling;
    }
    return child;
};

var Element = (function (Node$$1) {
    function Element(tagName) {
        Node$$1.call(this, 1 /* ELEMENT_NODE */, tagName.toUpperCase(), null);
        this.attributes = [];
    }

    if ( Node$$1 ) Element.__proto__ = Node$$1;
    Element.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Element.prototype.constructor = Element;

    var prototypeAccessors = { tagName: { configurable: true } };
    prototypeAccessors.tagName.get = function () {
        return this.nodeName;
    };
    Element.prototype.getAttribute = function getAttribute (name) {
        var attributes = this.attributes;
        var n = name.toLowerCase();
        var attr;
        for (var i = 0, l = attributes.length; i < l; i++) {
            attr = attributes[i];
            if (attr.name === n) {
                return attr.value;
            }
        }
        return null;
    };
    Element.prototype.setAttribute = function setAttribute (name, value) {
        var attributes = this.attributes;
        var n = name.toLowerCase();
        var v;
        if (typeof value === 'string') {
            v = value;
        }
        else {
            v = '' + value;
        }
        var attr;
        for (var i = 0, l = attributes.length; i < l; i++) {
            attr = attributes[i];
            if (attr.name === n) {
                attr.value = v;
                return;
            }
        }
        attributes.push({
            name: n,
            specified: true,
            value: v,
        });
    };
    Element.prototype.removeAttribute = function removeAttribute (name) {
        var n = name.toLowerCase();
        var attributes = this.attributes;
        for (var i = 0, l = attributes.length; i < l; i++) {
            var attr = attributes[i];
            if (attr.name === n) {
                attributes.splice(i, 1);
                return;
            }
        }
    };
    Element.prototype._cloneNode = function _cloneNode () {
        var this$1 = this;

        var node = new Element(this.tagName);
        var attrs = node.attributes = [];
        for (var i = 0, list = this$1.attributes; i < list.length; i += 1) {
            var attr = list[i];

            attrs.push({ name: attr.name, specified: attr.specified, value: attr.value });
        }
        return node;
    };

    Object.defineProperties( Element.prototype, prototypeAccessors );

    return Element;
}(Node));

var DocumentFragment = (function (Node$$1) {
    function DocumentFragment() {
        Node$$1.call(this, 11 /* DOCUMENT_FRAGMENT_NODE */, '#document-fragment', null);
    }

    if ( Node$$1 ) DocumentFragment.__proto__ = Node$$1;
    DocumentFragment.prototype = Object.create( Node$$1 && Node$$1.prototype );
    DocumentFragment.prototype.constructor = DocumentFragment;
    DocumentFragment.prototype._cloneNode = function _cloneNode () {
        return new DocumentFragment();
    };

    return DocumentFragment;
}(Node));

var Comment = (function (Node$$1) {
    function Comment(text) {
        Node$$1.call(this, 8 /* COMMENT_NODE */, '#comment', text);
    }

    if ( Node$$1 ) Comment.__proto__ = Node$$1;
    Comment.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Comment.prototype.constructor = Comment;
    Comment.prototype._cloneNode = function _cloneNode () {
        return new Comment(this.nodeValue);
    };

    return Comment;
}(Node));

var RawHTMLSection = (function (Node$$1) {
    function RawHTMLSection(text) {
        Node$$1.call(this, -1 /* RAW */, '#raw-html-section', text);
    }

    if ( Node$$1 ) RawHTMLSection.__proto__ = Node$$1;
    RawHTMLSection.prototype = Object.create( Node$$1 && Node$$1.prototype );
    RawHTMLSection.prototype.constructor = RawHTMLSection;

    return RawHTMLSection;
}(Node));

var Text = (function (Node$$1) {
    function Text(text) {
        Node$$1.call(this, 3 /* TEXT_NODE */, '#text', text);
    }

    if ( Node$$1 ) Text.__proto__ = Node$$1;
    Text.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Text.prototype.constructor = Text;
    Text.prototype._cloneNode = function _cloneNode () {
        return new Text(this.nodeValue);
    };

    return Text;
}(Node));

var Document = (function (Node$$1) {
    function Document() {
        Node$$1.call(this, 9 /* DOCUMENT_NODE */, '#document', null);
        this.documentElement = new Element('html');
        this.head = new Element('head');
        this.body = new Element('body');
        this.documentElement.appendChild(this.head);
        this.documentElement.appendChild(this.body);
        this.appendChild(this.documentElement);
    }

    if ( Node$$1 ) Document.__proto__ = Node$$1;
    Document.prototype = Object.create( Node$$1 && Node$$1.prototype );
    Document.prototype.constructor = Document;
    Document.prototype.createElement = function createElement (tagName) {
        return new Element(tagName);
    };
    Document.prototype.createTextNode = function createTextNode (text) {
        return new Text(text);
    };
    Document.prototype.createComment = function createComment (text) {
        return new Comment(text);
    };
    Document.prototype.createRawHTMLSection = function createRawHTMLSection (text) {
        return new RawHTMLSection(text);
    };
    Document.prototype.createDocumentFragment = function createDocumentFragment () {
        return new DocumentFragment();
    };

    return Document;
}(Node));

var HTMLParser = function HTMLParser(tokenize, document, voidMap) {
    this.tokenize = tokenize;
    this.document = document;
    this.voidMap = voidMap;
    this.tokenize = tokenize;
    this.document = document;
    this.voidMap = voidMap;
    this.parentStack = [];
};
HTMLParser.prototype.isVoid = function isVoid (element) {
    return this.voidMap[element.nodeName] === true;
};
HTMLParser.prototype.pushElement = function pushElement (token) {
    var el = this.document.createElement(token.tagName);
    for (var i = 0, list = token.attributes; i < list.length; i += 1) {
        var attr = list[i];

            el.setAttribute(attr[0], attr[1]);
    }
    if (this.isVoid(el)) {
        return this.appendChild(el);
    }
    this.parentStack.push(el);
};
HTMLParser.prototype.popElement = function popElement (token) {
    var el = this.parentStack.pop();
    if (el.nodeName !== token.tagName.toUpperCase()) {
        throw new Error('unbalanced tag');
    }
    this.appendChild(el);
};
HTMLParser.prototype.appendText = function appendText (token) {
    this.appendChild(this.document.createTextNode(token.chars));
};
HTMLParser.prototype.appendComment = function appendComment (token) {
    this.appendChild(this.document.createComment(token.chars));
};
HTMLParser.prototype.appendChild = function appendChild (node) {
    var parentNode = this.parentStack[this.parentStack.length - 1];
    parentNode.appendChild(node);
};
HTMLParser.prototype.parse = function parse (html) {
        var this$1 = this;

    var fragment = this.document.createDocumentFragment();
    this.parentStack.push(fragment);
    var tokens = this.tokenize(html);
    for (var i = 0, l = tokens.length; i < l; i++) {
        var token = tokens[i];
        switch (token.type) {
            case 'StartTag':
                this$1.pushElement(token);
                break;
            case 'EndTag':
                this$1.popElement(token);
                break;
            case 'Chars':
                this$1.appendText(token);
                break;
            case 'Comment':
                this$1.appendComment(token);
                break;
        }
    }
    return this.parentStack.pop();
};

var ESC = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
};
function matcher(char) {
    if (ESC[char] === undefined) {
        return char;
    }
    return ESC[char];
}
var HTMLSerializer = function HTMLSerializer(voidMap) {
    this.voidMap = voidMap;
};
HTMLSerializer.prototype.openTag = function openTag (element) {
    return '<' + element.nodeName.toLowerCase() + this.attributes(element.attributes) + '>';
};
HTMLSerializer.prototype.closeTag = function closeTag (element) {
    return '</' + element.nodeName.toLowerCase() + '>';
};
HTMLSerializer.prototype.isVoid = function isVoid (element) {
    return this.voidMap[element.nodeName] === true;
};
HTMLSerializer.prototype.attributes = function attributes (namedNodeMap) {
        var this$1 = this;

    var buffer = '';
    for (var i = 0, l = namedNodeMap.length; i < l; i++) {
        buffer += this$1.attr(namedNodeMap[i]);
    }
    return buffer;
};
HTMLSerializer.prototype.escapeAttrValue = function escapeAttrValue (attrValue) {
    if (attrValue.indexOf('&') > -1 || attrValue.indexOf('"') > -1) {
        return attrValue.replace(/[&"]/g, matcher);
    }
    return attrValue;
};
HTMLSerializer.prototype.attr = function attr (attr$1) {
    if (!attr$1.specified) {
        return '';
    }
    if (attr$1.value) {
        return ' ' + attr$1.name + '="' + this.escapeAttrValue(attr$1.value) + '"';
    }
    return ' ' + attr$1.name;
};
HTMLSerializer.prototype.escapeText = function escapeText (textNodeValue) {
    if (textNodeValue.indexOf('>') > -1 ||
        textNodeValue.indexOf('<') > -1 ||
        textNodeValue.indexOf('&') > -1) {
        return textNodeValue.replace(/[&<>]/g, matcher);
    }
    return textNodeValue;
};
HTMLSerializer.prototype.text = function text (text$1) {
    return this.escapeText(text$1.nodeValue);
};
HTMLSerializer.prototype.rawHTMLSection = function rawHTMLSection (text) {
    return text.nodeValue;
};
HTMLSerializer.prototype.comment = function comment (comment$1) {
    return '<!--' + comment$1.nodeValue + '-->';
};
HTMLSerializer.prototype.serializeChildren = function serializeChildren (node) {
        var this$1 = this;

    var buffer = '';
    var next = node.firstChild;
    while (next !== null) {
        buffer += this$1.serialize(next);
        next = next.nextSibling;
    }
    return buffer;
};
HTMLSerializer.prototype.serialize = function serialize (node) {
    var buffer = '';
    // open
    switch (node.nodeType) {
        case 1:
            buffer += this.openTag(node);
            break;
        case 3:
            buffer += this.text(node);
            break;
        case -1:
            buffer += this.rawHTMLSection(node);
            break;
        case 8:
            buffer += this.comment(node);
            break;
        default:
            break;
    }
    buffer += this.serializeChildren(node);
    if (node.nodeType === 1 && !this.isVoid(node)) {
        buffer += this.closeTag(node);
    }
    return buffer;
};

var voidMap = {
    AREA: true,
    BASE: true,
    BR: true,
    COL: true,
    COMMAND: true,
    EMBED: true,
    HR: true,
    IMG: true,
    INPUT: true,
    KEYGEN: true,
    LINK: true,
    META: true,
    PARAM: true,
    SOURCE: true,
    TRACK: true,
    WBR: true,
};

exports.Node = Node;
exports.Element = Element;
exports.DocumentFragment = DocumentFragment;
exports.Document = Document;
exports.HTMLParser = HTMLParser;
exports.HTMLSerializer = HTMLSerializer;
exports.voidMap = voidMap;

Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],38:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.HTML5Tokenizer = global.HTML5Tokenizer || {})));
}(this, (function (exports) { 'use strict';

var namedCharRefs = {
    Aacute: "Á", aacute: "á", Abreve: "Ă", abreve: "ă", ac: "∾", acd: "∿", acE: "∾̳", Acirc: "Â", acirc: "â", acute: "´", Acy: "А", acy: "а", AElig: "Æ", aelig: "æ", af: "\u2061", Afr: "𝔄", afr: "𝔞", Agrave: "À", agrave: "à", alefsym: "ℵ", aleph: "ℵ", Alpha: "Α", alpha: "α", Amacr: "Ā", amacr: "ā", amalg: "⨿", AMP: "&", amp: "&", And: "⩓", and: "∧", andand: "⩕", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", ange: "⦤", angle: "∠", angmsd: "∡", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angst: "Å", angzarr: "⍼", Aogon: "Ą", aogon: "ą", Aopf: "𝔸", aopf: "𝕒", ap: "≈", apacir: "⩯", apE: "⩰", ape: "≊", apid: "≋", apos: "'", ApplyFunction: "\u2061", approx: "≈", approxeq: "≊", Aring: "Å", aring: "å", Ascr: "𝒜", ascr: "𝒶", Assign: "≔", ast: "*", asymp: "≈", asympeq: "≍", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", awconint: "∳", awint: "⨑", backcong: "≌", backepsilon: "϶", backprime: "‵", backsim: "∽", backsimeq: "⋍", Backslash: "∖", Barv: "⫧", barvee: "⊽", Barwed: "⌆", barwed: "⌅", barwedge: "⌅", bbrk: "⎵", bbrktbrk: "⎶", bcong: "≌", Bcy: "Б", bcy: "б", bdquo: "„", becaus: "∵", Because: "∵", because: "∵", bemptyv: "⦰", bepsi: "϶", bernou: "ℬ", Bernoullis: "ℬ", Beta: "Β", beta: "β", beth: "ℶ", between: "≬", Bfr: "𝔅", bfr: "𝔟", bigcap: "⋂", bigcirc: "◯", bigcup: "⋃", bigodot: "⨀", bigoplus: "⨁", bigotimes: "⨂", bigsqcup: "⨆", bigstar: "★", bigtriangledown: "▽", bigtriangleup: "△", biguplus: "⨄", bigvee: "⋁", bigwedge: "⋀", bkarow: "⤍", blacklozenge: "⧫", blacksquare: "▪", blacktriangle: "▴", blacktriangledown: "▾", blacktriangleleft: "◂", blacktriangleright: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bNot: "⫭", bnot: "⌐", Bopf: "𝔹", bopf: "𝕓", bot: "⊥", bottom: "⊥", bowtie: "⋈", boxbox: "⧉", boxDL: "╗", boxDl: "╖", boxdL: "╕", boxdl: "┐", boxDR: "╔", boxDr: "╓", boxdR: "╒", boxdr: "┌", boxH: "═", boxh: "─", boxHD: "╦", boxHd: "╤", boxhD: "╥", boxhd: "┬", boxHU: "╩", boxHu: "╧", boxhU: "╨", boxhu: "┴", boxminus: "⊟", boxplus: "⊞", boxtimes: "⊠", boxUL: "╝", boxUl: "╜", boxuL: "╛", boxul: "┘", boxUR: "╚", boxUr: "╙", boxuR: "╘", boxur: "└", boxV: "║", boxv: "│", boxVH: "╬", boxVh: "╫", boxvH: "╪", boxvh: "┼", boxVL: "╣", boxVl: "╢", boxvL: "╡", boxvl: "┤", boxVR: "╠", boxVr: "╟", boxvR: "╞", boxvr: "├", bprime: "‵", Breve: "˘", breve: "˘", brvbar: "¦", Bscr: "ℬ", bscr: "𝒷", bsemi: "⁏", bsim: "∽", bsime: "⋍", bsol: "\\", bsolb: "⧅", bsolhsub: "⟈", bull: "•", bullet: "•", bump: "≎", bumpE: "⪮", bumpe: "≏", Bumpeq: "≎", bumpeq: "≏", Cacute: "Ć", cacute: "ć", Cap: "⋒", cap: "∩", capand: "⩄", capbrcup: "⩉", capcap: "⩋", capcup: "⩇", capdot: "⩀", CapitalDifferentialD: "ⅅ", caps: "∩︀", caret: "⁁", caron: "ˇ", Cayleys: "ℭ", ccaps: "⩍", Ccaron: "Č", ccaron: "č", Ccedil: "Ç", ccedil: "ç", Ccirc: "Ĉ", ccirc: "ĉ", Cconint: "∰", ccups: "⩌", ccupssm: "⩐", Cdot: "Ċ", cdot: "ċ", cedil: "¸", Cedilla: "¸", cemptyv: "⦲", cent: "¢", CenterDot: "·", centerdot: "·", Cfr: "ℭ", cfr: "𝔠", CHcy: "Ч", chcy: "ч", check: "✓", checkmark: "✓", Chi: "Χ", chi: "χ", cir: "○", circ: "ˆ", circeq: "≗", circlearrowleft: "↺", circlearrowright: "↻", circledast: "⊛", circledcirc: "⊚", circleddash: "⊝", CircleDot: "⊙", circledR: "®", circledS: "Ⓢ", CircleMinus: "⊖", CirclePlus: "⊕", CircleTimes: "⊗", cirE: "⧃", cire: "≗", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", ClockwiseContourIntegral: "∲", CloseCurlyDoubleQuote: "”", CloseCurlyQuote: "’", clubs: "♣", clubsuit: "♣", Colon: "∷", colon: ":", Colone: "⩴", colone: "≔", coloneq: "≔", comma: ",", commat: "@", comp: "∁", compfn: "∘", complement: "∁", complexes: "ℂ", cong: "≅", congdot: "⩭", Congruent: "≡", Conint: "∯", conint: "∮", ContourIntegral: "∮", Copf: "ℂ", copf: "𝕔", coprod: "∐", Coproduct: "∐", COPY: "©", copy: "©", copysr: "℗", CounterClockwiseContourIntegral: "∳", crarr: "↵", Cross: "⨯", cross: "✗", Cscr: "𝒞", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", cuesc: "⋟", cularr: "↶", cularrp: "⤽", Cup: "⋓", cup: "∪", cupbrcap: "⩈", CupCap: "≍", cupcap: "⩆", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curarrm: "⤼", curlyeqprec: "⋞", curlyeqsucc: "⋟", curlyvee: "⋎", curlywedge: "⋏", curren: "¤", curvearrowleft: "↶", curvearrowright: "↷", cuvee: "⋎", cuwed: "⋏", cwconint: "∲", cwint: "∱", cylcty: "⌭", Dagger: "‡", dagger: "†", daleth: "ℸ", Darr: "↡", dArr: "⇓", darr: "↓", dash: "‐", Dashv: "⫤", dashv: "⊣", dbkarow: "⤏", dblac: "˝", Dcaron: "Ď", dcaron: "ď", Dcy: "Д", dcy: "д", DD: "ⅅ", dd: "ⅆ", ddagger: "‡", ddarr: "⇊", DDotrahd: "⤑", ddotseq: "⩷", deg: "°", Del: "∇", Delta: "Δ", delta: "δ", demptyv: "⦱", dfisht: "⥿", Dfr: "𝔇", dfr: "𝔡", dHar: "⥥", dharl: "⇃", dharr: "⇂", DiacriticalAcute: "´", DiacriticalDot: "˙", DiacriticalDoubleAcute: "˝", DiacriticalGrave: "`", DiacriticalTilde: "˜", diam: "⋄", Diamond: "⋄", diamond: "⋄", diamondsuit: "♦", diams: "♦", die: "¨", DifferentialD: "ⅆ", digamma: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", DJcy: "Ђ", djcy: "ђ", dlcorn: "⌞", dlcrop: "⌍", dollar: "$", Dopf: "𝔻", dopf: "𝕕", Dot: "¨", dot: "˙", DotDot: "⃜", doteq: "≐", doteqdot: "≑", DotEqual: "≐", dotminus: "∸", dotplus: "∔", dotsquare: "⊡", doublebarwedge: "⌆", DoubleContourIntegral: "∯", DoubleDot: "¨", DoubleDownArrow: "⇓", DoubleLeftArrow: "⇐", DoubleLeftRightArrow: "⇔", DoubleLeftTee: "⫤", DoubleLongLeftArrow: "⟸", DoubleLongLeftRightArrow: "⟺", DoubleLongRightArrow: "⟹", DoubleRightArrow: "⇒", DoubleRightTee: "⊨", DoubleUpArrow: "⇑", DoubleUpDownArrow: "⇕", DoubleVerticalBar: "∥", DownArrow: "↓", Downarrow: "⇓", downarrow: "↓", DownArrowBar: "⤓", DownArrowUpArrow: "⇵", DownBreve: "̑", downdownarrows: "⇊", downharpoonleft: "⇃", downharpoonright: "⇂", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVector: "↽", DownLeftVectorBar: "⥖", DownRightTeeVector: "⥟", DownRightVector: "⇁", DownRightVectorBar: "⥗", DownTee: "⊤", DownTeeArrow: "↧", drbkarow: "⤐", drcorn: "⌟", drcrop: "⌌", Dscr: "𝒟", dscr: "𝒹", DScy: "Ѕ", dscy: "ѕ", dsol: "⧶", Dstrok: "Đ", dstrok: "đ", dtdot: "⋱", dtri: "▿", dtrif: "▾", duarr: "⇵", duhar: "⥯", dwangle: "⦦", DZcy: "Џ", dzcy: "џ", dzigrarr: "⟿", Eacute: "É", eacute: "é", easter: "⩮", Ecaron: "Ě", ecaron: "ě", ecir: "≖", Ecirc: "Ê", ecirc: "ê", ecolon: "≕", Ecy: "Э", ecy: "э", eDDot: "⩷", Edot: "Ė", eDot: "≑", edot: "ė", ee: "ⅇ", efDot: "≒", Efr: "𝔈", efr: "𝔢", eg: "⪚", Egrave: "È", egrave: "è", egs: "⪖", egsdot: "⪘", el: "⪙", Element: "∈", elinters: "⏧", ell: "ℓ", els: "⪕", elsdot: "⪗", Emacr: "Ē", emacr: "ē", empty: "∅", emptyset: "∅", EmptySmallSquare: "◻", emptyv: "∅", EmptyVerySmallSquare: "▫", emsp: " ", emsp13: " ", emsp14: " ", ENG: "Ŋ", eng: "ŋ", ensp: " ", Eogon: "Ę", eogon: "ę", Eopf: "𝔼", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", Epsilon: "Ε", epsilon: "ε", epsiv: "ϵ", eqcirc: "≖", eqcolon: "≕", eqsim: "≂", eqslantgtr: "⪖", eqslantless: "⪕", Equal: "⩵", equals: "=", EqualTilde: "≂", equest: "≟", Equilibrium: "⇌", equiv: "≡", equivDD: "⩸", eqvparsl: "⧥", erarr: "⥱", erDot: "≓", Escr: "ℰ", escr: "ℯ", esdot: "≐", Esim: "⩳", esim: "≂", Eta: "Η", eta: "η", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", euro: "€", excl: "!", exist: "∃", Exists: "∃", expectation: "ℰ", ExponentialE: "ⅇ", exponentiale: "ⅇ", fallingdotseq: "≒", Fcy: "Ф", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", Ffr: "𝔉", ffr: "𝔣", filig: "ﬁ", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", Fopf: "𝔽", fopf: "𝕗", ForAll: "∀", forall: "∀", fork: "⋔", forkv: "⫙", Fouriertrf: "ℱ", fpartint: "⨍", frac12: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", Fscr: "ℱ", fscr: "𝒻", gacute: "ǵ", Gamma: "Γ", gamma: "γ", Gammad: "Ϝ", gammad: "ϝ", gap: "⪆", Gbreve: "Ğ", gbreve: "ğ", Gcedil: "Ģ", Gcirc: "Ĝ", gcirc: "ĝ", Gcy: "Г", gcy: "г", Gdot: "Ġ", gdot: "ġ", gE: "≧", ge: "≥", gEl: "⪌", gel: "⋛", geq: "≥", geqq: "≧", geqslant: "⩾", ges: "⩾", gescc: "⪩", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", Gfr: "𝔊", gfr: "𝔤", Gg: "⋙", gg: "≫", ggg: "⋙", gimel: "ℷ", GJcy: "Ѓ", gjcy: "ѓ", gl: "≷", gla: "⪥", glE: "⪒", glj: "⪤", gnap: "⪊", gnapprox: "⪊", gnE: "≩", gne: "⪈", gneq: "⪈", gneqq: "≩", gnsim: "⋧", Gopf: "𝔾", gopf: "𝕘", grave: "`", GreaterEqual: "≥", GreaterEqualLess: "⋛", GreaterFullEqual: "≧", GreaterGreater: "⪢", GreaterLess: "≷", GreaterSlantEqual: "⩾", GreaterTilde: "≳", Gscr: "𝒢", gscr: "ℊ", gsim: "≳", gsime: "⪎", gsiml: "⪐", GT: ">", Gt: "≫", gt: ">", gtcc: "⪧", gtcir: "⩺", gtdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrapprox: "⪆", gtrarr: "⥸", gtrdot: "⋗", gtreqless: "⋛", gtreqqless: "⪌", gtrless: "≷", gtrsim: "≳", gvertneqq: "≩︀", gvnE: "≩︀", Hacek: "ˇ", hairsp: " ", half: "½", hamilt: "ℋ", HARDcy: "Ъ", hardcy: "ъ", hArr: "⇔", harr: "↔", harrcir: "⥈", harrw: "↭", Hat: "^", hbar: "ℏ", Hcirc: "Ĥ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", hercon: "⊹", Hfr: "ℌ", hfr: "𝔥", HilbertSpace: "ℋ", hksearow: "⤥", hkswarow: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", hookrightarrow: "↪", Hopf: "ℍ", hopf: "𝕙", horbar: "―", HorizontalLine: "─", Hscr: "ℋ", hscr: "𝒽", hslash: "ℏ", Hstrok: "Ħ", hstrok: "ħ", HumpDownHump: "≎", HumpEqual: "≏", hybull: "⁃", hyphen: "‐", Iacute: "Í", iacute: "í", ic: "\u2063", Icirc: "Î", icirc: "î", Icy: "И", icy: "и", Idot: "İ", IEcy: "Е", iecy: "е", iexcl: "¡", iff: "⇔", Ifr: "ℑ", ifr: "𝔦", Igrave: "Ì", igrave: "ì", ii: "ⅈ", iiiint: "⨌", iiint: "∭", iinfin: "⧜", iiota: "℩", IJlig: "Ĳ", ijlig: "ĳ", Im: "ℑ", Imacr: "Ī", imacr: "ī", image: "ℑ", ImaginaryI: "ⅈ", imagline: "ℐ", imagpart: "ℑ", imath: "ı", imof: "⊷", imped: "Ƶ", Implies: "⇒", in: "∈", incare: "℅", infin: "∞", infintie: "⧝", inodot: "ı", Int: "∬", int: "∫", intcal: "⊺", integers: "ℤ", Integral: "∫", intercal: "⊺", Intersection: "⋂", intlarhk: "⨗", intprod: "⨼", InvisibleComma: "\u2063", InvisibleTimes: "\u2062", IOcy: "Ё", iocy: "ё", Iogon: "Į", iogon: "į", Iopf: "𝕀", iopf: "𝕚", Iota: "Ι", iota: "ι", iprod: "⨼", iquest: "¿", Iscr: "ℐ", iscr: "𝒾", isin: "∈", isindot: "⋵", isinE: "⋹", isins: "⋴", isinsv: "⋳", isinv: "∈", it: "\u2062", Itilde: "Ĩ", itilde: "ĩ", Iukcy: "І", iukcy: "і", Iuml: "Ï", iuml: "ï", Jcirc: "Ĵ", jcirc: "ĵ", Jcy: "Й", jcy: "й", Jfr: "𝔍", jfr: "𝔧", jmath: "ȷ", Jopf: "𝕁", jopf: "𝕛", Jscr: "𝒥", jscr: "𝒿", Jsercy: "Ј", jsercy: "ј", Jukcy: "Є", jukcy: "є", Kappa: "Κ", kappa: "κ", kappav: "ϰ", Kcedil: "Ķ", kcedil: "ķ", Kcy: "К", kcy: "к", Kfr: "𝔎", kfr: "𝔨", kgreen: "ĸ", KHcy: "Х", khcy: "х", KJcy: "Ќ", kjcy: "ќ", Kopf: "𝕂", kopf: "𝕜", Kscr: "𝒦", kscr: "𝓀", lAarr: "⇚", Lacute: "Ĺ", lacute: "ĺ", laemptyv: "⦴", lagran: "ℒ", Lambda: "Λ", lambda: "λ", Lang: "⟪", lang: "⟨", langd: "⦑", langle: "⟨", lap: "⪅", Laplacetrf: "ℒ", laquo: "«", Larr: "↞", lArr: "⇐", larr: "←", larrb: "⇤", larrbfs: "⤟", larrfs: "⤝", larrhk: "↩", larrlp: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", lat: "⪫", lAtail: "⤛", latail: "⤙", late: "⪭", lates: "⪭︀", lBarr: "⤎", lbarr: "⤌", lbbrk: "❲", lbrace: "{", lbrack: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", Lcaron: "Ľ", lcaron: "ľ", Lcedil: "Ļ", lcedil: "ļ", lceil: "⌈", lcub: "{", Lcy: "Л", lcy: "л", ldca: "⤶", ldquo: "“", ldquor: "„", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", lE: "≦", le: "≤", LeftAngleBracket: "⟨", LeftArrow: "←", Leftarrow: "⇐", leftarrow: "←", LeftArrowBar: "⇤", LeftArrowRightArrow: "⇆", leftarrowtail: "↢", LeftCeiling: "⌈", LeftDoubleBracket: "⟦", LeftDownTeeVector: "⥡", LeftDownVector: "⇃", LeftDownVectorBar: "⥙", LeftFloor: "⌊", leftharpoondown: "↽", leftharpoonup: "↼", leftleftarrows: "⇇", LeftRightArrow: "↔", Leftrightarrow: "⇔", leftrightarrow: "↔", leftrightarrows: "⇆", leftrightharpoons: "⇋", leftrightsquigarrow: "↭", LeftRightVector: "⥎", LeftTee: "⊣", LeftTeeArrow: "↤", LeftTeeVector: "⥚", leftthreetimes: "⋋", LeftTriangle: "⊲", LeftTriangleBar: "⧏", LeftTriangleEqual: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVector: "↿", LeftUpVectorBar: "⥘", LeftVector: "↼", LeftVectorBar: "⥒", lEg: "⪋", leg: "⋚", leq: "≤", leqq: "≦", leqslant: "⩽", les: "⩽", lescc: "⪨", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessapprox: "⪅", lessdot: "⋖", lesseqgtr: "⋚", lesseqqgtr: "⪋", LessEqualGreater: "⋚", LessFullEqual: "≦", LessGreater: "≶", lessgtr: "≶", LessLess: "⪡", lesssim: "≲", LessSlantEqual: "⩽", LessTilde: "≲", lfisht: "⥼", lfloor: "⌊", Lfr: "𝔏", lfr: "𝔩", lg: "≶", lgE: "⪑", lHar: "⥢", lhard: "↽", lharu: "↼", lharul: "⥪", lhblk: "▄", LJcy: "Љ", ljcy: "љ", Ll: "⋘", ll: "≪", llarr: "⇇", llcorner: "⌞", Lleftarrow: "⇚", llhard: "⥫", lltri: "◺", Lmidot: "Ŀ", lmidot: "ŀ", lmoust: "⎰", lmoustache: "⎰", lnap: "⪉", lnapprox: "⪉", lnE: "≨", lne: "⪇", lneq: "⪇", lneqq: "≨", lnsim: "⋦", loang: "⟬", loarr: "⇽", lobrk: "⟦", LongLeftArrow: "⟵", Longleftarrow: "⟸", longleftarrow: "⟵", LongLeftRightArrow: "⟷", Longleftrightarrow: "⟺", longleftrightarrow: "⟷", longmapsto: "⟼", LongRightArrow: "⟶", Longrightarrow: "⟹", longrightarrow: "⟶", looparrowleft: "↫", looparrowright: "↬", lopar: "⦅", Lopf: "𝕃", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", lowbar: "_", LowerLeftArrow: "↙", LowerRightArrow: "↘", loz: "◊", lozenge: "◊", lozf: "⧫", lpar: "(", lparlt: "⦓", lrarr: "⇆", lrcorner: "⌟", lrhar: "⇋", lrhard: "⥭", lrm: "\u200e", lrtri: "⊿", lsaquo: "‹", Lscr: "ℒ", lscr: "𝓁", Lsh: "↰", lsh: "↰", lsim: "≲", lsime: "⪍", lsimg: "⪏", lsqb: "[", lsquo: "‘", lsquor: "‚", Lstrok: "Ł", lstrok: "ł", LT: "<", Lt: "≪", lt: "<", ltcc: "⪦", ltcir: "⩹", ltdot: "⋖", lthree: "⋋", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltri: "◃", ltrie: "⊴", ltrif: "◂", ltrPar: "⦖", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", macr: "¯", male: "♂", malt: "✠", maltese: "✠", Map: "⤅", map: "↦", mapsto: "↦", mapstodown: "↧", mapstoleft: "↤", mapstoup: "↥", marker: "▮", mcomma: "⨩", Mcy: "М", mcy: "м", mdash: "—", mDDot: "∺", measuredangle: "∡", MediumSpace: " ", Mellintrf: "ℳ", Mfr: "𝔐", mfr: "𝔪", mho: "℧", micro: "µ", mid: "∣", midast: "*", midcir: "⫰", middot: "·", minus: "−", minusb: "⊟", minusd: "∸", minusdu: "⨪", MinusPlus: "∓", mlcp: "⫛", mldr: "…", mnplus: "∓", models: "⊧", Mopf: "𝕄", mopf: "𝕞", mp: "∓", Mscr: "ℳ", mscr: "𝓂", mstpos: "∾", Mu: "Μ", mu: "μ", multimap: "⊸", mumap: "⊸", nabla: "∇", Nacute: "Ń", nacute: "ń", nang: "∠⃒", nap: "≉", napE: "⩰̸", napid: "≋̸", napos: "ŉ", napprox: "≉", natur: "♮", natural: "♮", naturals: "ℕ", nbsp: " ", nbump: "≎̸", nbumpe: "≏̸", ncap: "⩃", Ncaron: "Ň", ncaron: "ň", Ncedil: "Ņ", ncedil: "ņ", ncong: "≇", ncongdot: "⩭̸", ncup: "⩂", Ncy: "Н", ncy: "н", ndash: "–", ne: "≠", nearhk: "⤤", neArr: "⇗", nearr: "↗", nearrow: "↗", nedot: "≐̸", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", nequiv: "≢", nesear: "⤨", nesim: "≂̸", NestedGreaterGreater: "≫", NestedLessLess: "≪", NewLine: "\u000a", nexist: "∄", nexists: "∄", Nfr: "𝔑", nfr: "𝔫", ngE: "≧̸", nge: "≱", ngeq: "≱", ngeqq: "≧̸", ngeqslant: "⩾̸", nges: "⩾̸", nGg: "⋙̸", ngsim: "≵", nGt: "≫⃒", ngt: "≯", ngtr: "≯", nGtv: "≫̸", nhArr: "⇎", nharr: "↮", nhpar: "⫲", ni: "∋", nis: "⋼", nisd: "⋺", niv: "∋", NJcy: "Њ", njcy: "њ", nlArr: "⇍", nlarr: "↚", nldr: "‥", nlE: "≦̸", nle: "≰", nLeftarrow: "⇍", nleftarrow: "↚", nLeftrightarrow: "⇎", nleftrightarrow: "↮", nleq: "≰", nleqq: "≦̸", nleqslant: "⩽̸", nles: "⩽̸", nless: "≮", nLl: "⋘̸", nlsim: "≴", nLt: "≪⃒", nlt: "≮", nltri: "⋪", nltrie: "⋬", nLtv: "≪̸", nmid: "∤", NoBreak: "\u2060", NonBreakingSpace: " ", Nopf: "ℕ", nopf: "𝕟", Not: "⫬", not: "¬", NotCongruent: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", NotElement: "∉", NotEqual: "≠", NotEqualTilde: "≂̸", NotExists: "∄", NotGreater: "≯", NotGreaterEqual: "≱", NotGreaterFullEqual: "≧̸", NotGreaterGreater: "≫̸", NotGreaterLess: "≹", NotGreaterSlantEqual: "⩾̸", NotGreaterTilde: "≵", NotHumpDownHump: "≎̸", NotHumpEqual: "≏̸", notin: "∉", notindot: "⋵̸", notinE: "⋹̸", notinva: "∉", notinvb: "⋷", notinvc: "⋶", NotLeftTriangle: "⋪", NotLeftTriangleBar: "⧏̸", NotLeftTriangleEqual: "⋬", NotLess: "≮", NotLessEqual: "≰", NotLessGreater: "≸", NotLessLess: "≪̸", NotLessSlantEqual: "⩽̸", NotLessTilde: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", notni: "∌", notniva: "∌", notnivb: "⋾", notnivc: "⋽", NotPrecedes: "⊀", NotPrecedesEqual: "⪯̸", NotPrecedesSlantEqual: "⋠", NotReverseElement: "∌", NotRightTriangle: "⋫", NotRightTriangleBar: "⧐̸", NotRightTriangleEqual: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", NotSubset: "⊂⃒", NotSubsetEqual: "⊈", NotSucceeds: "⊁", NotSucceedsEqual: "⪰̸", NotSucceedsSlantEqual: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", NotSupersetEqual: "⊉", NotTilde: "≁", NotTildeEqual: "≄", NotTildeFullEqual: "≇", NotTildeTilde: "≉", NotVerticalBar: "∤", npar: "∦", nparallel: "∦", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", npr: "⊀", nprcue: "⋠", npre: "⪯̸", nprec: "⊀", npreceq: "⪯̸", nrArr: "⇏", nrarr: "↛", nrarrc: "⤳̸", nrarrw: "↝̸", nRightarrow: "⇏", nrightarrow: "↛", nrtri: "⋫", nrtrie: "⋭", nsc: "⊁", nsccue: "⋡", nsce: "⪰̸", Nscr: "𝒩", nscr: "𝓃", nshortmid: "∤", nshortparallel: "∦", nsim: "≁", nsime: "≄", nsimeq: "≄", nsmid: "∤", nspar: "∦", nsqsube: "⋢", nsqsupe: "⋣", nsub: "⊄", nsubE: "⫅̸", nsube: "⊈", nsubset: "⊂⃒", nsubseteq: "⊈", nsubseteqq: "⫅̸", nsucc: "⊁", nsucceq: "⪰̸", nsup: "⊅", nsupE: "⫆̸", nsupe: "⊉", nsupset: "⊃⃒", nsupseteq: "⊉", nsupseteqq: "⫆̸", ntgl: "≹", Ntilde: "Ñ", ntilde: "ñ", ntlg: "≸", ntriangleleft: "⋪", ntrianglelefteq: "⋬", ntriangleright: "⋫", ntrianglerighteq: "⋭", Nu: "Ν", nu: "ν", num: "#", numero: "№", numsp: " ", nvap: "≍⃒", nVDash: "⊯", nVdash: "⊮", nvDash: "⊭", nvdash: "⊬", nvge: "≥⃒", nvgt: ">⃒", nvHarr: "⤄", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwarhk: "⤣", nwArr: "⇖", nwarr: "↖", nwarrow: "↖", nwnear: "⤧", Oacute: "Ó", oacute: "ó", oast: "⊛", ocir: "⊚", Ocirc: "Ô", ocirc: "ô", Ocy: "О", ocy: "о", odash: "⊝", Odblac: "Ő", odblac: "ő", odiv: "⨸", odot: "⊙", odsold: "⦼", OElig: "Œ", oelig: "œ", ofcir: "⦿", Ofr: "𝔒", ofr: "𝔬", ogon: "˛", Ograve: "Ò", ograve: "ò", ogt: "⧁", ohbar: "⦵", ohm: "Ω", oint: "∮", olarr: "↺", olcir: "⦾", olcross: "⦻", oline: "‾", olt: "⧀", Omacr: "Ō", omacr: "ō", Omega: "Ω", omega: "ω", Omicron: "Ο", omicron: "ο", omid: "⦶", ominus: "⊖", Oopf: "𝕆", oopf: "𝕠", opar: "⦷", OpenCurlyDoubleQuote: "“", OpenCurlyQuote: "‘", operp: "⦹", oplus: "⊕", Or: "⩔", or: "∨", orarr: "↻", ord: "⩝", order: "ℴ", orderof: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oS: "Ⓢ", Oscr: "𝒪", oscr: "ℴ", Oslash: "Ø", oslash: "ø", osol: "⊘", Otilde: "Õ", otilde: "õ", Otimes: "⨷", otimes: "⊗", otimesas: "⨶", Ouml: "Ö", ouml: "ö", ovbar: "⌽", OverBar: "‾", OverBrace: "⏞", OverBracket: "⎴", OverParenthesis: "⏜", par: "∥", para: "¶", parallel: "∥", parsim: "⫳", parsl: "⫽", part: "∂", PartialD: "∂", Pcy: "П", pcy: "п", percnt: "%", period: ".", permil: "‰", perp: "⊥", pertenk: "‱", Pfr: "𝔓", pfr: "𝔭", Phi: "Φ", phi: "φ", phiv: "ϕ", phmmat: "ℳ", phone: "☎", Pi: "Π", pi: "π", pitchfork: "⋔", piv: "ϖ", planck: "ℏ", planckh: "ℎ", plankv: "ℏ", plus: "+", plusacir: "⨣", plusb: "⊞", pluscir: "⨢", plusdo: "∔", plusdu: "⨥", pluse: "⩲", PlusMinus: "±", plusmn: "±", plussim: "⨦", plustwo: "⨧", pm: "±", Poincareplane: "ℌ", pointint: "⨕", Popf: "ℙ", popf: "𝕡", pound: "£", Pr: "⪻", pr: "≺", prap: "⪷", prcue: "≼", prE: "⪳", pre: "⪯", prec: "≺", precapprox: "⪷", preccurlyeq: "≼", Precedes: "≺", PrecedesEqual: "⪯", PrecedesSlantEqual: "≼", PrecedesTilde: "≾", preceq: "⪯", precnapprox: "⪹", precneqq: "⪵", precnsim: "⋨", precsim: "≾", Prime: "″", prime: "′", primes: "ℙ", prnap: "⪹", prnE: "⪵", prnsim: "⋨", prod: "∏", Product: "∏", profalar: "⌮", profline: "⌒", profsurf: "⌓", prop: "∝", Proportion: "∷", Proportional: "∝", propto: "∝", prsim: "≾", prurel: "⊰", Pscr: "𝒫", pscr: "𝓅", Psi: "Ψ", psi: "ψ", puncsp: " ", Qfr: "𝔔", qfr: "𝔮", qint: "⨌", Qopf: "ℚ", qopf: "𝕢", qprime: "⁗", Qscr: "𝒬", qscr: "𝓆", quaternions: "ℍ", quatint: "⨖", quest: "?", questeq: "≟", QUOT: "\"", quot: "\"", rAarr: "⇛", race: "∽̱", Racute: "Ŕ", racute: "ŕ", radic: "√", raemptyv: "⦳", Rang: "⟫", rang: "⟩", rangd: "⦒", range: "⦥", rangle: "⟩", raquo: "»", Rarr: "↠", rArr: "⇒", rarr: "→", rarrap: "⥵", rarrb: "⇥", rarrbfs: "⤠", rarrc: "⤳", rarrfs: "⤞", rarrhk: "↪", rarrlp: "↬", rarrpl: "⥅", rarrsim: "⥴", Rarrtl: "⤖", rarrtl: "↣", rarrw: "↝", rAtail: "⤜", ratail: "⤚", ratio: "∶", rationals: "ℚ", RBarr: "⤐", rBarr: "⤏", rbarr: "⤍", rbbrk: "❳", rbrace: "}", rbrack: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", Rcaron: "Ř", rcaron: "ř", Rcedil: "Ŗ", rcedil: "ŗ", rceil: "⌉", rcub: "}", Rcy: "Р", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdquo: "”", rdquor: "”", rdsh: "↳", Re: "ℜ", real: "ℜ", realine: "ℛ", realpart: "ℜ", reals: "ℝ", rect: "▭", REG: "®", reg: "®", ReverseElement: "∋", ReverseEquilibrium: "⇋", ReverseUpEquilibrium: "⥯", rfisht: "⥽", rfloor: "⌋", Rfr: "ℜ", rfr: "𝔯", rHar: "⥤", rhard: "⇁", rharu: "⇀", rharul: "⥬", Rho: "Ρ", rho: "ρ", rhov: "ϱ", RightAngleBracket: "⟩", RightArrow: "→", Rightarrow: "⇒", rightarrow: "→", RightArrowBar: "⇥", RightArrowLeftArrow: "⇄", rightarrowtail: "↣", RightCeiling: "⌉", RightDoubleBracket: "⟧", RightDownTeeVector: "⥝", RightDownVector: "⇂", RightDownVectorBar: "⥕", RightFloor: "⌋", rightharpoondown: "⇁", rightharpoonup: "⇀", rightleftarrows: "⇄", rightleftharpoons: "⇌", rightrightarrows: "⇉", rightsquigarrow: "↝", RightTee: "⊢", RightTeeArrow: "↦", RightTeeVector: "⥛", rightthreetimes: "⋌", RightTriangle: "⊳", RightTriangleBar: "⧐", RightTriangleEqual: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVector: "↾", RightUpVectorBar: "⥔", RightVector: "⇀", RightVectorBar: "⥓", ring: "˚", risingdotseq: "≓", rlarr: "⇄", rlhar: "⇌", rlm: "\u200f", rmoust: "⎱", rmoustache: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", robrk: "⟧", ropar: "⦆", Ropf: "ℝ", ropf: "𝕣", roplus: "⨮", rotimes: "⨵", RoundImplies: "⥰", rpar: ")", rpargt: "⦔", rppolint: "⨒", rrarr: "⇉", Rrightarrow: "⇛", rsaquo: "›", Rscr: "ℛ", rscr: "𝓇", Rsh: "↱", rsh: "↱", rsqb: "]", rsquo: "’", rsquor: "’", rthree: "⋌", rtimes: "⋊", rtri: "▹", rtrie: "⊵", rtrif: "▸", rtriltri: "⧎", RuleDelayed: "⧴", ruluhar: "⥨", rx: "℞", Sacute: "Ś", sacute: "ś", sbquo: "‚", Sc: "⪼", sc: "≻", scap: "⪸", Scaron: "Š", scaron: "š", sccue: "≽", scE: "⪴", sce: "⪰", Scedil: "Ş", scedil: "ş", Scirc: "Ŝ", scirc: "ŝ", scnap: "⪺", scnE: "⪶", scnsim: "⋩", scpolint: "⨓", scsim: "≿", Scy: "С", scy: "с", sdot: "⋅", sdotb: "⊡", sdote: "⩦", searhk: "⤥", seArr: "⇘", searr: "↘", searrow: "↘", sect: "§", semi: ";", seswar: "⤩", setminus: "∖", setmn: "∖", sext: "✶", Sfr: "𝔖", sfr: "𝔰", sfrown: "⌢", sharp: "♯", SHCHcy: "Щ", shchcy: "щ", SHcy: "Ш", shcy: "ш", ShortDownArrow: "↓", ShortLeftArrow: "←", shortmid: "∣", shortparallel: "∥", ShortRightArrow: "→", ShortUpArrow: "↑", shy: "\u00ad", Sigma: "Σ", sigma: "σ", sigmaf: "ς", sigmav: "ς", sim: "∼", simdot: "⩪", sime: "≃", simeq: "≃", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", slarr: "←", SmallCircle: "∘", smallsetminus: "∖", smashp: "⨳", smeparsl: "⧤", smid: "∣", smile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", SOFTcy: "Ь", softcy: "ь", sol: "/", solb: "⧄", solbar: "⌿", Sopf: "𝕊", sopf: "𝕤", spades: "♠", spadesuit: "♠", spar: "∥", sqcap: "⊓", sqcaps: "⊓︀", sqcup: "⊔", sqcups: "⊔︀", Sqrt: "√", sqsub: "⊏", sqsube: "⊑", sqsubset: "⊏", sqsubseteq: "⊑", sqsup: "⊐", sqsupe: "⊒", sqsupset: "⊐", sqsupseteq: "⊒", squ: "□", Square: "□", square: "□", SquareIntersection: "⊓", SquareSubset: "⊏", SquareSubsetEqual: "⊑", SquareSuperset: "⊐", SquareSupersetEqual: "⊒", SquareUnion: "⊔", squarf: "▪", squf: "▪", srarr: "→", Sscr: "𝒮", sscr: "𝓈", ssetmn: "∖", ssmile: "⌣", sstarf: "⋆", Star: "⋆", star: "☆", starf: "★", straightepsilon: "ϵ", straightphi: "ϕ", strns: "¯", Sub: "⋐", sub: "⊂", subdot: "⪽", subE: "⫅", sube: "⊆", subedot: "⫃", submult: "⫁", subnE: "⫋", subne: "⊊", subplus: "⪿", subrarr: "⥹", Subset: "⋐", subset: "⊂", subseteq: "⊆", subseteqq: "⫅", SubsetEqual: "⊆", subsetneq: "⊊", subsetneqq: "⫋", subsim: "⫇", subsub: "⫕", subsup: "⫓", succ: "≻", succapprox: "⪸", succcurlyeq: "≽", Succeeds: "≻", SucceedsEqual: "⪰", SucceedsSlantEqual: "≽", SucceedsTilde: "≿", succeq: "⪰", succnapprox: "⪺", succneqq: "⪶", succnsim: "⋩", succsim: "≿", SuchThat: "∋", Sum: "∑", sum: "∑", sung: "♪", Sup: "⋑", sup: "⊃", sup1: "¹", sup2: "²", sup3: "³", supdot: "⪾", supdsub: "⫘", supE: "⫆", supe: "⊇", supedot: "⫄", Superset: "⊃", SupersetEqual: "⊇", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supne: "⊋", supplus: "⫀", Supset: "⋑", supset: "⊃", supseteq: "⊇", supseteqq: "⫆", supsetneq: "⊋", supsetneqq: "⫌", supsim: "⫈", supsub: "⫔", supsup: "⫖", swarhk: "⤦", swArr: "⇙", swarr: "↙", swarrow: "↙", swnwar: "⤪", szlig: "ß", Tab: "\u0009", target: "⌖", Tau: "Τ", tau: "τ", tbrk: "⎴", Tcaron: "Ť", tcaron: "ť", Tcedil: "Ţ", tcedil: "ţ", Tcy: "Т", tcy: "т", tdot: "⃛", telrec: "⌕", Tfr: "𝔗", tfr: "𝔱", there4: "∴", Therefore: "∴", therefore: "∴", Theta: "Θ", theta: "θ", thetasym: "ϑ", thetav: "ϑ", thickapprox: "≈", thicksim: "∼", ThickSpace: "  ", thinsp: " ", ThinSpace: " ", thkap: "≈", thksim: "∼", THORN: "Þ", thorn: "þ", Tilde: "∼", tilde: "˜", TildeEqual: "≃", TildeFullEqual: "≅", TildeTilde: "≈", times: "×", timesb: "⊠", timesbar: "⨱", timesd: "⨰", tint: "∭", toea: "⤨", top: "⊤", topbot: "⌶", topcir: "⫱", Topf: "𝕋", topf: "𝕥", topfork: "⫚", tosa: "⤩", tprime: "‴", TRADE: "™", trade: "™", triangle: "▵", triangledown: "▿", triangleleft: "◃", trianglelefteq: "⊴", triangleq: "≜", triangleright: "▹", trianglerighteq: "⊵", tridot: "◬", trie: "≜", triminus: "⨺", TripleDot: "⃛", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", Tscr: "𝒯", tscr: "𝓉", TScy: "Ц", tscy: "ц", TSHcy: "Ћ", tshcy: "ћ", Tstrok: "Ŧ", tstrok: "ŧ", twixt: "≬", twoheadleftarrow: "↞", twoheadrightarrow: "↠", Uacute: "Ú", uacute: "ú", Uarr: "↟", uArr: "⇑", uarr: "↑", Uarrocir: "⥉", Ubrcy: "Ў", ubrcy: "ў", Ubreve: "Ŭ", ubreve: "ŭ", Ucirc: "Û", ucirc: "û", Ucy: "У", ucy: "у", udarr: "⇅", Udblac: "Ű", udblac: "ű", udhar: "⥮", ufisht: "⥾", Ufr: "𝔘", ufr: "𝔲", Ugrave: "Ù", ugrave: "ù", uHar: "⥣", uharl: "↿", uharr: "↾", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", Umacr: "Ū", umacr: "ū", uml: "¨", UnderBar: "_", UnderBrace: "⏟", UnderBracket: "⎵", UnderParenthesis: "⏝", Union: "⋃", UnionPlus: "⊎", Uogon: "Ų", uogon: "ų", Uopf: "𝕌", uopf: "𝕦", UpArrow: "↑", Uparrow: "⇑", uparrow: "↑", UpArrowBar: "⤒", UpArrowDownArrow: "⇅", UpDownArrow: "↕", Updownarrow: "⇕", updownarrow: "↕", UpEquilibrium: "⥮", upharpoonleft: "↿", upharpoonright: "↾", uplus: "⊎", UpperLeftArrow: "↖", UpperRightArrow: "↗", Upsi: "ϒ", upsi: "υ", upsih: "ϒ", Upsilon: "Υ", upsilon: "υ", UpTee: "⊥", UpTeeArrow: "↥", upuparrows: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", Uring: "Ů", uring: "ů", urtri: "◹", Uscr: "𝒰", uscr: "𝓊", utdot: "⋰", Utilde: "Ũ", utilde: "ũ", utri: "▵", utrif: "▴", uuarr: "⇈", Uuml: "Ü", uuml: "ü", uwangle: "⦧", vangrt: "⦜", varepsilon: "ϵ", varkappa: "ϰ", varnothing: "∅", varphi: "ϕ", varpi: "ϖ", varpropto: "∝", vArr: "⇕", varr: "↕", varrho: "ϱ", varsigma: "ς", varsubsetneq: "⊊︀", varsubsetneqq: "⫋︀", varsupsetneq: "⊋︀", varsupsetneqq: "⫌︀", vartheta: "ϑ", vartriangleleft: "⊲", vartriangleright: "⊳", Vbar: "⫫", vBar: "⫨", vBarv: "⫩", Vcy: "В", vcy: "в", VDash: "⊫", Vdash: "⊩", vDash: "⊨", vdash: "⊢", Vdashl: "⫦", Vee: "⋁", vee: "∨", veebar: "⊻", veeeq: "≚", vellip: "⋮", Verbar: "‖", verbar: "|", Vert: "‖", vert: "|", VerticalBar: "∣", VerticalLine: "|", VerticalSeparator: "❘", VerticalTilde: "≀", VeryThinSpace: " ", Vfr: "𝔙", vfr: "𝔳", vltri: "⊲", vnsub: "⊂⃒", vnsup: "⊃⃒", Vopf: "𝕍", vopf: "𝕧", vprop: "∝", vrtri: "⊳", Vscr: "𝒱", vscr: "𝓋", vsubnE: "⫋︀", vsubne: "⊊︀", vsupnE: "⫌︀", vsupne: "⊋︀", Vvdash: "⊪", vzigzag: "⦚", Wcirc: "Ŵ", wcirc: "ŵ", wedbar: "⩟", Wedge: "⋀", wedge: "∧", wedgeq: "≙", weierp: "℘", Wfr: "𝔚", wfr: "𝔴", Wopf: "𝕎", wopf: "𝕨", wp: "℘", wr: "≀", wreath: "≀", Wscr: "𝒲", wscr: "𝓌", xcap: "⋂", xcirc: "◯", xcup: "⋃", xdtri: "▽", Xfr: "𝔛", xfr: "𝔵", xhArr: "⟺", xharr: "⟷", Xi: "Ξ", xi: "ξ", xlArr: "⟸", xlarr: "⟵", xmap: "⟼", xnis: "⋻", xodot: "⨀", Xopf: "𝕏", xopf: "𝕩", xoplus: "⨁", xotime: "⨂", xrArr: "⟹", xrarr: "⟶", Xscr: "𝒳", xscr: "𝓍", xsqcup: "⨆", xuplus: "⨄", xutri: "△", xvee: "⋁", xwedge: "⋀", Yacute: "Ý", yacute: "ý", YAcy: "Я", yacy: "я", Ycirc: "Ŷ", ycirc: "ŷ", Ycy: "Ы", ycy: "ы", yen: "¥", Yfr: "𝔜", yfr: "𝔶", YIcy: "Ї", yicy: "ї", Yopf: "𝕐", yopf: "𝕪", Yscr: "𝒴", yscr: "𝓎", YUcy: "Ю", yucy: "ю", Yuml: "Ÿ", yuml: "ÿ", Zacute: "Ź", zacute: "ź", Zcaron: "Ž", zcaron: "ž", Zcy: "З", zcy: "з", Zdot: "Ż", zdot: "ż", zeetrf: "ℨ", ZeroWidthSpace: "​", Zeta: "Ζ", zeta: "ζ", Zfr: "ℨ", zfr: "𝔷", ZHcy: "Ж", zhcy: "ж", zigrarr: "⇝", Zopf: "ℤ", zopf: "𝕫", Zscr: "𝒵", zscr: "𝓏", zwj: "\u200d", zwnj: "\u200c"
};

var HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
var CHARCODE = /^#([0-9]+)$/;
var NAMED = /^([A-Za-z0-9]+)$/;
var EntityParser = /** @class */ (function () {
    function EntityParser(named) {
        this.named = named;
    }
    EntityParser.prototype.parse = function (entity) {
        if (!entity) {
            return;
        }
        var matches = entity.match(HEXCHARCODE);
        if (matches) {
            return String.fromCharCode(parseInt(matches[1], 16));
        }
        matches = entity.match(CHARCODE);
        if (matches) {
            return String.fromCharCode(parseInt(matches[1], 10));
        }
        matches = entity.match(NAMED);
        if (matches) {
            return this.named[matches[1]];
        }
    };
    return EntityParser;
}());

var WSP = /[\t\n\f ]/;
var ALPHA = /[A-Za-z]/;
var CRLF = /\r\n?/g;
function isSpace(char) {
    return WSP.test(char);
}
function isAlpha(char) {
    return ALPHA.test(char);
}
function preprocessInput(input) {
    return input.replace(CRLF, "\n");
}
function unwrap(maybe, msg) {
    if (!maybe)
        throw new Error((msg || 'value') + " was null");
    return maybe;
}

var EventedTokenizer = /** @class */ (function () {
    function EventedTokenizer(delegate, entityParser) {
        this.delegate = delegate;
        this.entityParser = entityParser;
        this.state = null;
        this.input = null;
        this.index = -1;
        this.tagLine = -1;
        this.tagColumn = -1;
        this.line = -1;
        this.column = -1;
        this.states = {
            beforeData: function () {
                var char = this.peek();
                if (char === "<") {
                    this.state = 'tagOpen';
                    this.markTagStart();
                    this.consume();
                }
                else {
                    this.state = 'data';
                    this.delegate.beginData();
                }
            },
            data: function () {
                var char = this.peek();
                if (char === "<") {
                    this.delegate.finishData();
                    this.state = 'tagOpen';
                    this.markTagStart();
                    this.consume();
                }
                else if (char === "&") {
                    this.consume();
                    this.delegate.appendToData(this.consumeCharRef() || "&");
                }
                else {
                    this.consume();
                    this.delegate.appendToData(char);
                }
            },
            tagOpen: function () {
                var char = this.consume();
                if (char === "!") {
                    this.state = 'markupDeclaration';
                }
                else if (char === "/") {
                    this.state = 'endTagOpen';
                }
                else if (isAlpha(char)) {
                    this.state = 'tagName';
                    this.delegate.beginStartTag();
                    this.delegate.appendToTagName(char.toLowerCase());
                }
            },
            markupDeclaration: function () {
                var char = this.consume();
                if (char === "-" && this.input.charAt(this.index) === "-") {
                    this.consume();
                    this.state = 'commentStart';
                    this.delegate.beginComment();
                }
            },
            commentStart: function () {
                var char = this.consume();
                if (char === "-") {
                    this.state = 'commentStartDash';
                }
                else if (char === ">") {
                    this.delegate.finishComment();
                    this.state = 'beforeData';
                }
                else {
                    this.delegate.appendToCommentData(char);
                    this.state = 'comment';
                }
            },
            commentStartDash: function () {
                var char = this.consume();
                if (char === "-") {
                    this.state = 'commentEnd';
                }
                else if (char === ">") {
                    this.delegate.finishComment();
                    this.state = 'beforeData';
                }
                else {
                    this.delegate.appendToCommentData("-");
                    this.state = 'comment';
                }
            },
            comment: function () {
                var char = this.consume();
                if (char === "-") {
                    this.state = 'commentEndDash';
                }
                else {
                    this.delegate.appendToCommentData(char);
                }
            },
            commentEndDash: function () {
                var char = this.consume();
                if (char === "-") {
                    this.state = 'commentEnd';
                }
                else {
                    this.delegate.appendToCommentData("-" + char);
                    this.state = 'comment';
                }
            },
            commentEnd: function () {
                var char = this.consume();
                if (char === ">") {
                    this.delegate.finishComment();
                    this.state = 'beforeData';
                }
                else {
                    this.delegate.appendToCommentData("--" + char);
                    this.state = 'comment';
                }
            },
            tagName: function () {
                var char = this.consume();
                if (isSpace(char)) {
                    this.state = 'beforeAttributeName';
                }
                else if (char === "/") {
                    this.state = 'selfClosingStartTag';
                }
                else if (char === ">") {
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.delegate.appendToTagName(char);
                }
            },
            beforeAttributeName: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.consume();
                    return;
                }
                else if (char === "/") {
                    this.state = 'selfClosingStartTag';
                    this.consume();
                }
                else if (char === ">") {
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else if (char === '=') {
                    this.delegate.reportSyntaxError("attribute name cannot start with equals sign");
                    this.state = 'attributeName';
                    this.delegate.beginAttribute();
                    this.consume();
                    this.delegate.appendToAttributeName(char);
                }
                else {
                    this.state = 'attributeName';
                    this.delegate.beginAttribute();
                }
            },
            attributeName: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.state = 'afterAttributeName';
                    this.consume();
                }
                else if (char === "/") {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.state = 'selfClosingStartTag';
                }
                else if (char === "=") {
                    this.state = 'beforeAttributeValue';
                    this.consume();
                }
                else if (char === ">") {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else if (char === '"' || char === "'" || char === '<') {
                    this.delegate.reportSyntaxError(char + " is not a valid character within attribute names");
                    this.consume();
                    this.delegate.appendToAttributeName(char);
                }
                else {
                    this.consume();
                    this.delegate.appendToAttributeName(char);
                }
            },
            afterAttributeName: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.consume();
                    return;
                }
                else if (char === "/") {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.state = 'selfClosingStartTag';
                }
                else if (char === "=") {
                    this.consume();
                    this.state = 'beforeAttributeValue';
                }
                else if (char === ">") {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.state = 'attributeName';
                    this.delegate.beginAttribute();
                    this.delegate.appendToAttributeName(char);
                }
            },
            beforeAttributeValue: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.consume();
                }
                else if (char === '"') {
                    this.state = 'attributeValueDoubleQuoted';
                    this.delegate.beginAttributeValue(true);
                    this.consume();
                }
                else if (char === "'") {
                    this.state = 'attributeValueSingleQuoted';
                    this.delegate.beginAttributeValue(true);
                    this.consume();
                }
                else if (char === ">") {
                    this.delegate.beginAttributeValue(false);
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.state = 'attributeValueUnquoted';
                    this.delegate.beginAttributeValue(false);
                    this.consume();
                    this.delegate.appendToAttributeValue(char);
                }
            },
            attributeValueDoubleQuoted: function () {
                var char = this.consume();
                if (char === '"') {
                    this.delegate.finishAttributeValue();
                    this.state = 'afterAttributeValueQuoted';
                }
                else if (char === "&") {
                    this.delegate.appendToAttributeValue(this.consumeCharRef('"') || "&");
                }
                else {
                    this.delegate.appendToAttributeValue(char);
                }
            },
            attributeValueSingleQuoted: function () {
                var char = this.consume();
                if (char === "'") {
                    this.delegate.finishAttributeValue();
                    this.state = 'afterAttributeValueQuoted';
                }
                else if (char === "&") {
                    this.delegate.appendToAttributeValue(this.consumeCharRef("'") || "&");
                }
                else {
                    this.delegate.appendToAttributeValue(char);
                }
            },
            attributeValueUnquoted: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.state = 'beforeAttributeName';
                }
                else if (char === "&") {
                    this.consume();
                    this.delegate.appendToAttributeValue(this.consumeCharRef(">") || "&");
                }
                else if (char === ">") {
                    this.delegate.finishAttributeValue();
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.consume();
                    this.delegate.appendToAttributeValue(char);
                }
            },
            afterAttributeValueQuoted: function () {
                var char = this.peek();
                if (isSpace(char)) {
                    this.consume();
                    this.state = 'beforeAttributeName';
                }
                else if (char === "/") {
                    this.consume();
                    this.state = 'selfClosingStartTag';
                }
                else if (char === ">") {
                    this.consume();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.state = 'beforeAttributeName';
                }
            },
            selfClosingStartTag: function () {
                var char = this.peek();
                if (char === ">") {
                    this.consume();
                    this.delegate.markTagAsSelfClosing();
                    this.delegate.finishTag();
                    this.state = 'beforeData';
                }
                else {
                    this.state = 'beforeAttributeName';
                }
            },
            endTagOpen: function () {
                var char = this.consume();
                if (isAlpha(char)) {
                    this.state = 'tagName';
                    this.delegate.beginEndTag();
                    this.delegate.appendToTagName(char.toLowerCase());
                }
            }
        };
        this.reset();
    }
    EventedTokenizer.prototype.reset = function () {
        this.state = 'beforeData';
        this.input = '';
        this.index = 0;
        this.line = 1;
        this.column = 0;
        this.tagLine = -1;
        this.tagColumn = -1;
        this.delegate.reset();
    };
    EventedTokenizer.prototype.tokenize = function (input) {
        this.reset();
        this.tokenizePart(input);
        this.tokenizeEOF();
    };
    EventedTokenizer.prototype.tokenizePart = function (input) {
        this.input += preprocessInput(input);
        while (this.index < this.input.length) {
            this.states[this.state].call(this);
        }
    };
    EventedTokenizer.prototype.tokenizeEOF = function () {
        this.flushData();
    };
    EventedTokenizer.prototype.flushData = function () {
        if (this.state === 'data') {
            this.delegate.finishData();
            this.state = 'beforeData';
        }
    };
    EventedTokenizer.prototype.peek = function () {
        return this.input.charAt(this.index);
    };
    EventedTokenizer.prototype.consume = function () {
        var char = this.peek();
        this.index++;
        if (char === "\n") {
            this.line++;
            this.column = 0;
        }
        else {
            this.column++;
        }
        return char;
    };
    EventedTokenizer.prototype.consumeCharRef = function () {
        var endIndex = this.input.indexOf(';', this.index);
        if (endIndex === -1) {
            return;
        }
        var entity = this.input.slice(this.index, endIndex);
        var chars = this.entityParser.parse(entity);
        if (chars) {
            var count = entity.length;
            // consume the entity chars
            while (count) {
                this.consume();
                count--;
            }
            // consume the `;`
            this.consume();
            return chars;
        }
    };
    EventedTokenizer.prototype.markTagStart = function () {
        // these properties to be removed in next major bump
        this.tagLine = this.line;
        this.tagColumn = this.column;
        if (this.delegate.tagOpen) {
            this.delegate.tagOpen();
        }
    };
    return EventedTokenizer;
}());

var Tokenizer = /** @class */ (function () {
    function Tokenizer(entityParser, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this._token = null;
        this.startLine = 1;
        this.startColumn = 0;
        this.tokens = [];
        this.currentAttribute = null;
        this.tokenizer = new EventedTokenizer(this, entityParser);
    }
    Object.defineProperty(Tokenizer.prototype, "token", {
        get: function () {
            return unwrap(this._token);
        },
        set: function (value) {
            this._token = value;
        },
        enumerable: true,
        configurable: true
    });
    Tokenizer.prototype.tokenize = function (input) {
        this.tokens = [];
        this.tokenizer.tokenize(input);
        return this.tokens;
    };
    Tokenizer.prototype.tokenizePart = function (input) {
        this.tokens = [];
        this.tokenizer.tokenizePart(input);
        return this.tokens;
    };
    Tokenizer.prototype.tokenizeEOF = function () {
        this.tokens = [];
        this.tokenizer.tokenizeEOF();
        return this.tokens[0];
    };
    Tokenizer.prototype.reset = function () {
        this._token = null;
        this.startLine = 1;
        this.startColumn = 0;
    };
    Tokenizer.prototype.addLocInfo = function () {
        if (this.options.loc) {
            this.token.loc = {
                start: {
                    line: this.startLine,
                    column: this.startColumn
                },
                end: {
                    line: this.tokenizer.line,
                    column: this.tokenizer.column
                }
            };
        }
        this.startLine = this.tokenizer.line;
        this.startColumn = this.tokenizer.column;
    };
    // Data
    Tokenizer.prototype.beginData = function () {
        this.token = {
            type: 'Chars',
            chars: ''
        };
        this.tokens.push(this.token);
    };
    Tokenizer.prototype.appendToData = function (char) {
        this.token.chars += char;
    };
    Tokenizer.prototype.finishData = function () {
        this.addLocInfo();
    };
    // Comment
    Tokenizer.prototype.beginComment = function () {
        this.token = {
            type: 'Comment',
            chars: ''
        };
        this.tokens.push(this.token);
    };
    Tokenizer.prototype.appendToCommentData = function (char) {
        this.token.chars += char;
    };
    Tokenizer.prototype.finishComment = function () {
        this.addLocInfo();
    };
    // Tags - basic
    Tokenizer.prototype.beginStartTag = function () {
        this.token = {
            type: 'StartTag',
            tagName: '',
            attributes: [],
            selfClosing: false
        };
        this.tokens.push(this.token);
    };
    Tokenizer.prototype.beginEndTag = function () {
        this.token = {
            type: 'EndTag',
            tagName: ''
        };
        this.tokens.push(this.token);
    };
    Tokenizer.prototype.finishTag = function () {
        this.addLocInfo();
    };
    Tokenizer.prototype.markTagAsSelfClosing = function () {
        this.token.selfClosing = true;
    };
    // Tags - name
    Tokenizer.prototype.appendToTagName = function (char) {
        this.token.tagName += char;
    };
    // Tags - attributes
    Tokenizer.prototype.beginAttribute = function () {
        var attributes = unwrap(this.token.attributes, "current token's attributs");
        this.currentAttribute = ["", "", false];
        attributes.push(this.currentAttribute);
    };
    Tokenizer.prototype.appendToAttributeName = function (char) {
        var currentAttribute = unwrap(this.currentAttribute);
        currentAttribute[0] += char;
    };
    Tokenizer.prototype.beginAttributeValue = function (isQuoted) {
        var currentAttribute = unwrap(this.currentAttribute);
        currentAttribute[2] = isQuoted;
    };
    Tokenizer.prototype.appendToAttributeValue = function (char) {
        var currentAttribute = unwrap(this.currentAttribute);
        currentAttribute[1] = currentAttribute[1] || "";
        currentAttribute[1] += char;
    };
    Tokenizer.prototype.finishAttributeValue = function () {
    };
    Tokenizer.prototype.reportSyntaxError = function (message) {
        this.token.syntaxError = message;
    };
    return Tokenizer;
}());

function tokenize(input, options) {
    var tokenizer = new Tokenizer(new EntityParser(namedCharRefs), options);
    return tokenizer.tokenize(input);
}

exports.HTML5NamedCharRefs = namedCharRefs;
exports.EntityParser = EntityParser;
exports.EventedTokenizer = EventedTokenizer;
exports.Tokenizer = Tokenizer;
exports.tokenize = tokenize;

Object.defineProperty(exports, '__esModule', { value: true });

})));



},{}]},{},[10]);

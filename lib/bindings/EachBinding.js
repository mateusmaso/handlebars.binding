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

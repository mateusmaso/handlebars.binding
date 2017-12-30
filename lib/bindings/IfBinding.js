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

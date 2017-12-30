"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = HandlebarsBinding;

var _handlebars = require("handlebars.element");

var _handlebars2 = _interopRequireDefault(_handlebars);

var _bindings = require("./bindings");

var _core = require("./core");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HandlebarsBinding(Handlebars) {
  (0, _handlebars2.default)(Handlebars);

  var extend = Handlebars.Utils.extend;


  extend(Handlebars, {
    Binding: _bindings.Binding,
    IfBinding: _bindings.IfBinding,
    EachBinding: _bindings.EachBinding,
    bind: _core.bind,
    unbind: _core.unbind,
    update: _core.update,
    registerBindingHelpers: _core.registerBindingHelpers
  });

  extend(Handlebars.Utils, {
    path: _utils.path,
    traverse: _utils.traverse,
    removeBetween: _utils.removeBetween,
    nodesBetween: _utils.nodesBetween,
    removeClass: _utils.removeClass,
    addClass: _utils.addClass,
    hasClass: _utils.hasClass,
    isFalsy: _utils.isFalsy
  });

  Handlebars.registerBindingHelpers();

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding(window.Handlebars);
}

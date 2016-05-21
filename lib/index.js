'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bindings = require('./bindings');

var _core = require('./core');

var _utils = require('./utils');

var _deps = require('./deps');

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HandlebarsBinding(Handlebars, Observe, Platform) {
  var extend = Handlebars.Utils.extend;


  extend(_deps2.default, {
    Handlebars: Handlebars,
    Observer: Observe.Observer,
    ArrayObserver: Observe.ArrayObserver,
    ObjectObserver: Observe.ObjectObserver,
    PathObserver: Observe.PathObserver,
    Platform: Platform
  });

  extend(Handlebars, {
    Binding: _bindings.Binding,
    IfBinding: _bindings.IfBinding,
    EachBinding: _bindings.EachBinding,
    bind: _core.bind,
    unbind: _core.unbind,
    update: _core.update
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

  (0, _core.register)();

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars && window.Platform) {
  HandlebarsBinding = HandlebarsBinding(window.Handlebars, {
    Observer: window.Observer,
    ArrayObserver: window.ArrayObserver,
    ObjectObserver: window.ObjectObserver,
    PathObserver: window.PathObserver
  }, window.Platform);
}

exports.default = HandlebarsBinding;

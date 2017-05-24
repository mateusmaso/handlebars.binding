"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;
exports.unbind = unbind;
exports.update = update;
exports.register = register;

var _observeJs = require("observe-js");

var _observeJs2 = _interopRequireDefault(_observeJs);

var _bindings = require("../bindings");

var _utils = require("../utils");

var _deps = require("../deps");

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  _deps2.default.Handlebars.registerHelper('bind', function (keypath, options) {
    return new _bindings.Binding(this, keypath, null, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper('if', function (conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && (0, _deps.getUtils)().isString(conditional)) {
      keypath = conditional;
      conditional = (0, _utils.path)(this, keypath);
    }

    return new _bindings.IfBinding(this, keypath, conditional, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper('each', function (items, options) {
    return new _bindings.EachBinding(this, null, items, options).initialize();
  });

  _deps2.default.Handlebars.registerHelper("unless", function (conditional, options) {
    var fn = options.fn,
        inverse = options.inverse;

    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return _deps2.default.Handlebars.helpers.if.apply(this, [conditional, options]);
  });

  _deps2.default.Handlebars.registerElement('binding', function (attributes) {
    return attributes.id;
  });
};

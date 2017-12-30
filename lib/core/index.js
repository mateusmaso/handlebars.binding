"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;
exports.unbind = unbind;
exports.update = update;
exports.registerBindingHelpers = registerBindingHelpers;

var _observeJs = require("observe-js");

var _observeJs2 = _interopRequireDefault(_observeJs);

var _bindings = require("../bindings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function update() {
  Platform.performMicrotaskCheckpoint();
};

function registerBindingHelpers() {
  var Handlebars = this;
  var Utils = this.Utils;

  this.registerHelper('bind', function (keypath, options) {
    return new _bindings.Binding(Handlebars, this, keypath, null, options).initialize();
  });

  this.registerHelper('if', function (conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && Utils.isString(conditional)) {
      keypath = conditional;
      conditional = Utils.path(this, keypath);
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

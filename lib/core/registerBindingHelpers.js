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

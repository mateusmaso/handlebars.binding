import {
  Binding,
  IfBinding,
  EachBinding
} from "../bindings";

export default function registerBindingHelpers() {
  var Handlebars = this;
  var {path, isString} = this.Utils;

  this.registerHelper('bind', function(keypath, options) {
    return new Binding(Handlebars, this, keypath, null, options).initialize();
  });

  this.registerHelper('if', function(conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && isString(conditional)) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    return new IfBinding(Handlebars, this, keypath, conditional, options).initialize();
  });

  this.registerHelper('each', function(items, options) {
    return new EachBinding(Handlebars, this, null, items, options).initialize();
  });

  this.registerHelper("unless", function(conditional, options) {
    var {fn, inverse} = options;
    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return Handlebars.helpers.if.apply(this, [conditional, options]);
  });

  this.registerElement('binding', function(attributes) {
    return attributes.id;
  });
};

import {traverse, path} from "./utils"
import Binding from "./binding"
import IfBinding from "./if_binding"
import EachBinding from "./each_binding"
var {helpers} = Handlebars;
var {isString} = Handlebars.Utils;

export function bind(root) {
  traverse(root, (node) => {
    if (node.binding) {
      node.binding.observe();
    } else if (node.bindings) {
      node.bindings.forEach((binding) => binding.observe());
    }
  });
};

export function unbind(root) {
  traverse(root, (node) => {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach((binding) => binding.stopObserving());
    }
  });
};

export function update() {
  Platform.performMicrotaskCheckpoint();
};

export function register() {
  Handlebars.registerHelper('bind', function(keypath, options) {
    return new Binding(this, keypath, null, options).initialize();
  });

  Handlebars.registerHelper('if', function(conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && isString(conditional)) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    return new IfBinding(this, keypath, conditional, options).initialize();
  });

  Handlebars.registerHelper('each', function(items, options) {
    return new EachBinding(this, null, items, options).initialize();
  });

  Handlebars.registerHelper("unless", function(conditional, options) {
    var {fn, inverse} = options;
    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return helpers.if.apply(this, [conditional, options]);
  });

  Handlebars.registerElement('binding', function(attributes) {
    return attributes.id;
  });
};

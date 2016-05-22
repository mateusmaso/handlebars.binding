import Observe from "observe-js";

import {
  Binding,
  IfBinding,
  EachBinding
} from "../bindings";

import {
  traverse,
  path
} from "../utils";

import deps, {getUtils} from "../deps";

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
  deps.Handlebars.registerHelper('bind', function(keypath, options) {
    return new Binding(this, keypath, null, options).initialize();
  });

  deps.Handlebars.registerHelper('if', function(conditional, options) {
    var keypath;

    if (options.hash.bindAttr) {
      options.hash.attr = options.hash.bindAttr;
      options.hash.bind = true;
    }

    if (options.hash.bind && getUtils().isString(conditional)) {
      keypath = conditional;
      conditional = path(this, keypath);
    }

    return new IfBinding(this, keypath, conditional, options).initialize();
  });

  deps.Handlebars.registerHelper('each', function(items, options) {
    return new EachBinding(this, null, items, options).initialize();
  });

  deps.Handlebars.registerHelper("unless", function(conditional, options) {
    var {fn, inverse} = options;
    var thenHash = options.hash.then;
    var elseHash = options.hash.else;

    options.fn = inverse;
    options.inverse = fn;
    options.hash.then = elseHash;
    options.hash.else = thenHash;

    return deps.Handlebars.helpers.if.apply(this, [conditional, options]);
  });

  deps.Handlebars.registerElement('binding', function(attributes) {
    return attributes.id;
  });
};

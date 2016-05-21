import {
  Binding,
  IfBinding,
  EachBinding
} from "./bindings";

import {
  bind,
  unbind,
  register,
  update
} from './core';

import {
  path,
  traverse,
  removeBetween,
  nodesBetween,
  removeClass,
  addClass,
  hasClass,
  isFalsy
} from './utils';

import deps from "./deps";

function HandlebarsBinding(Handlebars, Observe, Platform) {
  var {extend} = Handlebars.Utils;

  extend(deps, {
    Handlebars,
    Observer: Observe.Observer,
    ArrayObserver: Observe.ArrayObserver,
    ObjectObserver: Observe.ObjectObserver,
    PathObserver: Observe.PathObserver,
    Platform
  });

  extend(Handlebars, {
    Binding,
    IfBinding,
    EachBinding,
    bind,
    unbind,
    update
  });

  extend(Handlebars.Utils, {
    path,
    traverse,
    removeBetween,
    nodesBetween,
    removeClass,
    addClass,
    hasClass,
    isFalsy
  });

  register();

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

export default HandlebarsBinding;

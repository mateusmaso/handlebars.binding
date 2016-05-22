import HandlebarsElement from "handlebars.element";

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

function HandlebarsBinding(Handlebars) {
  HandlebarsElement(Handlebars);

  var {extend} = Handlebars.Utils;

  extend(deps, {Handlebars});

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

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding = HandlebarsBinding(window.Handlebars);
}

export default HandlebarsBinding;

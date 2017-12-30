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
  update,
  registerBindingHelpers
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

export default function HandlebarsBinding(Handlebars) {
  HandlebarsElement(Handlebars);

  var {extend} = Handlebars.Utils;

  extend(Handlebars, {
    Binding,
    IfBinding,
    EachBinding,
    bind,
    unbind,
    update,
    registerBindingHelpers
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

  Handlebars.registerBindingHelpers();

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding(window.Handlebars);
}

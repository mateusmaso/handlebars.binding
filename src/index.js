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

function bindAll(object, parent) {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "function") {
      object[key] = object[key].bind(parent)
    }
  })

  return object;
};

export default function HandlebarsBinding(Handlebars) {
  HandlebarsElement(Handlebars);

  Object.assign(Handlebars, bindAll({
    Binding,
    IfBinding,
    EachBinding,
    bind,
    unbind,
    update,
    registerBindingHelpers
  }, Handlebars));

  Object.assign(Handlebars.Utils, bindAll({
    path,
    traverse,
    removeBetween,
    nodesBetween,
    removeClass,
    addClass,
    hasClass,
    isFalsy,
  }, Handlebars.Utils));

  Handlebars.registerBindingHelpers();

  return Handlebars;
}

if (typeof window !== "undefined" && window.Handlebars) {
  HandlebarsBinding(window.Handlebars);
}

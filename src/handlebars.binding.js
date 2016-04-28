import Binding from './handlebars.binding/binding';
import IfBinding from './handlebars.binding/if_binding';
import EachBinding from './handlebars.binding/each_binding';
import {bind, unbind, register, update} from './handlebars.binding/core';
import {path, traverse, removeBetween, nodesBetween, removeClass, addClass, hasClass, isFalsy} from './handlebars.binding/utils';

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(global.Handlebars);
    exports = factory(global.Handlebars);
  } else {
    factory(root.Handlebars);
  }

}(this, function(Handlebars) {

  var {extend} = Handlebars.Utils;

  extend(Handlebars, {Binding, IfBinding, EachBinding, bind, unbind, update});
  extend(Handlebars.Utils, {path, traverse, removeBetween, nodesBetween, removeClass, addClass, hasClass, isFalsy});

  register();

}));

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;
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

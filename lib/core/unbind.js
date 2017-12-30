"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unbind;
function unbind(root) {
  this.Utils.traverse(root, function (node) {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach(function (binding) {
        return binding.stopObserving();
      });
    }
  });
};

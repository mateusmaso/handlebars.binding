"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traverse;
function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    this.traverse(node, callback);
    node = node.nextSibling;
  }
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeBetween;
function removeBetween(firstNode, lastNode) {
  var nodes = this.nodesBetween(firstNode, lastNode);
  nodes.forEach(function (node) {
    return node.remove();
  });
  return nodes;
}

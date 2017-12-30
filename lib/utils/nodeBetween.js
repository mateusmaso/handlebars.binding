"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodesBetween;
function nodesBetween(firstNode, lastNode) {
  var next = firstNode.nextSibling;
  var nodes = [];

  while (next && next != lastNode) {
    var sibling = next.nextSibling;
    nodes.push(next);
    next = sibling;
  }

  return nodes;
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasClass;
function hasClass(node, value) {
  return node.className.match(new RegExp("(\\s|^)" + value + "(\\s|$)"));
}

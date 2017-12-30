"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addClass;
function addClass(node, value) {
  if (!this.hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += " " + value;
    }
  }
}

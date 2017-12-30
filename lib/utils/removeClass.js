'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeClass;
function removeClass(node, value) {
  if (this.hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
  }
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFalsy;
function isFalsy(object) {
  return !object || this.isEmpty(object);
}

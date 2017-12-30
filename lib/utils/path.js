'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = path;
function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach(function (path) {
    return object = object[path];
  });
  return object;
}

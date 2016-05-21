'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFalsy = isFalsy;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.nodesBetween = nodesBetween;
exports.removeBetween = removeBetween;
exports.traverse = traverse;
exports.path = path;

var _deps = require('../deps');

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFalsy(object) {
  return !object || (0, _deps.getUtils)().isEmpty(object);
}

function hasClass(node, value) {
  return node.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
}

function addClass(node, value) {
  if (!hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += ' ' + value;
    }
  }
}

function removeClass(node, value) {
  if (hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
  }
}

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

function removeBetween(firstNode, lastNode) {
  var nodes = nodesBetween(firstNode, lastNode);
  nodes.forEach(function (node) {
    return node.remove();
  });
  return nodes;
}

function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    traverse(node, callback);
    node = node.nextSibling;
  }
}

function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach(function (path) {
    return object = object[path];
  });
  return object;
}

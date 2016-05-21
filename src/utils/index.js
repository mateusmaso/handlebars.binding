import deps, {getUtils} from "../deps";

export function isFalsy(object) {
  return !object || getUtils().isEmpty(object);
}

export function hasClass(node, value) {
  return node.className.match(new RegExp(`(\\s|^)${value}(\\s|$)`));
}

export function addClass(node, value) {
  if (!hasClass(node, value)) {
    if (node.className.length == 0) {
      return node.className = value;
    } else {
      return node.className += ` ${value}`;
    }
  }
}

export function removeClass(node, value) {
  if (hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp(`(\\s|^)${value}(\\s|$)`), '');
  }
}

export function nodesBetween(firstNode, lastNode) {
  var next = firstNode.nextSibling;
  var nodes = [];

  while (next && next != lastNode) {
    var sibling = next.nextSibling;
    nodes.push(next);
    next = sibling;
  }

  return nodes;
}

export function removeBetween(firstNode, lastNode) {
  var nodes = nodesBetween(firstNode, lastNode);
  nodes.forEach((node) => node.remove());
  return nodes;
}

export function traverse(node, callback) {
  callback.apply(this, [node]);
  node = node.firstChild;
  while (node) {
    traverse(node, callback);
    node = node.nextSibling;
  }
}

export function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach((path) => object = object[path]);
  return object;
}

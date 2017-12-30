export default function hasClass(node, value) {
  return node.className.match(new RegExp(`(\\s|^)${value}(\\s|$)`));
}

export default function removeClass(node, value) {
  if (this.hasClass(node, value)) {
    return node.className = node.className.replace(new RegExp(`(\\s|^)${value}(\\s|$)`), '');
  }
}

export default function removeBetween(firstNode, lastNode) {
  var nodes = this.nodesBetween(firstNode, lastNode);
  nodes.forEach((node) => node.remove());
  return nodes;
}

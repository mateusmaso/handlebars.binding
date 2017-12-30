export default function unbind(root) {
  this.Utils.traverse(root, (node) => {
    if (node.binding) {
      node.binding.stopObserving();
    } else if (node.bindings) {
      node.bindings.forEach((binding) => binding.stopObserving());
    }
  });
};

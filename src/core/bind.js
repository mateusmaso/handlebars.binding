export default function bind(root) {
  this.Utils.traverse(root, (node) => {
    if (node.binding) {
      node.binding.observe();
    } else if (node.bindings) {
      node.bindings.forEach((binding) => binding.observe());
    }
  });
};

export default function path(context, key) {
  var paths = key.split('.');
  var object = context[paths.shift()];
  paths.forEach((path) => object = object[path]);
  return object;
}

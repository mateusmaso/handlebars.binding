import {path, removeClass, addClass, removeBetween} from "./utils"
var {attributes, store, SafeString} = Handlebars;
var {uniqueId, flatten, isString, escapeExpression, isArray, isObject, insertAfter} = Handlebars.Utils;

export default class Binding {
  constructor(context, keypath, value, options) {
    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.id = uniqueId();
    this.value = value;
    this.context = context;
    this.keypath = keypath;
    this.options = options;
    if (keypath) this.value = path(this.context, this.keypath);
  }

  setNode(node) {
    node.bindings = node.bindings || [];
    node.bindings.push(this);
    return this.node = node;
  }

  setMarker(marker) {
    marker.binding = this;
    return this.marker = marker;
  }

  setDelimiter(delimiter) {
    return this.delimiter = delimiter;
  }

  setOutput(output) {
    this.previousOutput = this.output;
    return this.output = output;
  }

  setObserver(observer) {
    return this.observer = observer;
  }

  createElement() {
    return `<hb-binding id="${this.id}"></hb-binding>`;
  }

  createAttribute() {
    return `hb-binding-${this.id}`;
  }

  initialize() {
    if (this.options.hash.attr) {
      return this.initializeAttribute();
    } else if (!this.options.fn) {
      return this.initializeInline();
    } else {
      return this.initializeBlock();
    }
  }

  initializeAttribute(node) {
    var attributeName = `binding-${this.id}`;

    Handlebars.registerAttribute(attributeName, (node) => {
      return null;
    }, {
      ready: (node) => {
        this.setNode(node);
        this.render({initialize: true});
        this.observe();
        delete attributes[attributeName];
      }
    });

    return this.createAttribute();
  }

  initializeInline() {
    this.setNode(document.createTextNode(""));
    this.render({initialize: true});
    this.observe();
    store.hold(this.id, flatten([this.node]));
    return new SafeString(this.createElement());
  }

  initializeBlock() {
    this.setMarker(document.createTextNode(""));
    this.setDelimiter(document.createTextNode(""));
    var nodes = this.render({initialize: true});
    this.observe();
    store.hold(this.id, flatten([this.marker, nodes, this.delimiter]));
    return new SafeString(this.createElement());
  }

  runOutput() {
    if (this.options.fn) {
      this.setOutput(this.options.fn(this.context));
    } else {
      this.setOutput(this.value);
    }
  }

  render(options={}) {
    this.runOutput();

    if (this.options.hash.attr) {
      return this.renderAttribute(options);
    } else if (!this.options.fn) {
      return this.renderInline(options);
    } else {
      return this.renderBlock(options);
    }
  }

  renderAttribute(options={}) {
    if (this.options.hash.attr == true) {
      if (this.previousOutput != this.output) {
        this.node.removeAttribute(this.previousOutput);
        this.node.setAttribute(this.output, "");
      }
    } else if (this.options.hash.attr == "class") {
      removeClass(this.node, this.previousOutput);
      addClass(this.node, this.output);
    } else {
      this.node.setAttribute(this.options.hash.attr, this.output);
    }
  }

  renderInline(options={}) {
    if (isString(this.output)) {
      this.node.textContent = escapeExpression(new SafeString(this.output));
    } else {
      this.node.textContent = escapeExpression(this.output);
    }
  }

  renderBlock(options={}) {
    if (options.initialize) {
      return Handlebars.parseHTML(this.output); // gambi
    } else {
      removeBetween(this.marker, this.delimiter).forEach((node) => Handlebars.unbind(node));
      insertAfter(this.marker, Handlebars.parseHTML(this.output));
    }
  }

  observe() {
    if (isArray(this.value)) {
      this.setObserver(new ArrayObserver(this.value));
      this.observer.open(() => this.render());
    } else if (isObject(this.value)) {
      this.setObserver(new ObjectObserver(this.value));
      this.observer.open(() => this.render());
    } else {
      this.setObserver(new PathObserver(this.context, this.keypath));
      this.observer.open((value) => {
        this.value = value;
        this.render();
      });
    }
  }

  stopObserving() {
    this.observer.close();
  }
}

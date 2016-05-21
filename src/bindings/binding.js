import {
  path,
  removeClass,
  addClass,
  removeBetween
} from "../utils";

import deps, {getUtils} from "../deps";
import {unbind} from "../core";

export default class Binding {
  constructor(context, keypath, value, options) {
    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.id = getUtils().uniqueId();
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

    deps.Handlebars.registerAttribute(attributeName, (node) => {
      return null;
    }, {
      ready: (node) => {
        this.setNode(node);
        this.render({initialize: true});
        this.observe();
        delete deps.Handlebars.attributes[attributeName];
      }
    });

    return this.createAttribute();
  }

  initializeInline() {
    this.setNode(document.createTextNode(""));
    this.render({initialize: true});
    this.observe();
    deps.Handlebars.store.hold(this.id, getUtils().flatten([this.node]));
    return new deps.Handlebars.SafeString(this.createElement());
  }

  initializeBlock() {
    this.setMarker(document.createTextNode(""));
    this.setDelimiter(document.createTextNode(""));
    var nodes = this.render({initialize: true});
    this.observe();
    deps.Handlebars.store.hold(this.id, getUtils().flatten([this.marker, nodes, this.delimiter]));
    return new deps.Handlebars.SafeString(this.createElement());
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
    if (getUtils().isString(this.output)) {
      this.node.textContent = getUtils().escapeExpression(new deps.Handlebars.SafeString(this.output));
    } else {
      this.node.textContent = getUtils().escapeExpression(this.output);
    }
  }

  renderBlock(options={}) {
    if (options.initialize) {
      return deps.Handlebars.parseHTML(this.output); // gambi
    } else {
      removeBetween(this.marker, this.delimiter).forEach((node) => unbind(node));
      getUtils().insertAfter(this.marker, deps.Handlebars.parseHTML(this.output));
    }
  }

  observe() {
    if (getUtils().isArray(this.value)) {
      this.setObserver(new deps.ArrayObserver(this.value));
      this.observer.open(() => this.render());
    } else if (getUtils().isObject(this.value)) {
      this.setObserver(new deps.ObjectObserver(this.value));
      this.observer.open(() => this.render());
    } else {
      this.setObserver(new deps.PathObserver(this.context, this.keypath));
      this.observer.open((value) => {
        this.value = value;
        this.render();
      });
    }
  }

  stopObserving() {
    if (this.observer) {
      this.observer.close();
    }
  }
}

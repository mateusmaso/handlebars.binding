import {
  ArrayObserver,
  ObjectObserver,
  PathObserver
} from "observe-js";

export default class Binding {
  constructor(Handlebars, context, keypath, value, options) {
    var {uniqueId, path} = Handlebars.Utils;

    this.node;
    this.observer;
    this.output;
    this.previousOutput;
    this.marker;
    this.delimiter;

    this.Handlebars = Handlebars;
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

    this.Handlebars.registerAttribute(attributeName, (node) => {
      return null;
    }, {
      ready: (node) => {
        this.setNode(node);
        this.render({initialize: true});
        this.observe();
        delete this.Handlebars.attributes[attributeName];
      }
    });

    return this.createAttribute();
  }

  initializeInline() {
    var {store} = this.Handlebars;
    var {flatten} = this.Handlebars.Utils;
    this.setNode(document.createTextNode(""));
    this.render({initialize: true});
    this.observe();
    store.hold(this.id, flatten([this.node]));
    return new this.Handlebars.SafeString(this.createElement());
  }

  initializeBlock() {
    var {store} = this.Handlebars;
    var {flatten} = this.Handlebars.Utils;
    this.setMarker(document.createTextNode(""));
    this.setDelimiter(document.createTextNode(""));
    var nodes = this.render({initialize: true});
    this.observe();
    store.hold(this.id, flatten([this.marker, nodes, this.delimiter]));
    return new this.Handlebars.SafeString(this.createElement());
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
    var {removeClass, addClass} = this.Handlebars.Utils;

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
    var {isString, escapeExpression} = this.Handlebars.Utils;

    if (isString(this.output)) {
      this.node.textContent = escapeExpression(new this.Handlebars.SafeString(this.output));
    } else {
      this.node.textContent = escapeExpression(this.output);
    }
  }

  renderBlock(options={}) {
    var {parseHTML, unbind} = this.Handlebars;
    var {removeBetween, insertAfter} = this.Handlebars.Utils;

    if (options.initialize) {
      return parseHTML(this.output); // gambi
    } else {
      removeBetween(this.marker, this.delimiter).forEach((node) => unbind(node));
      insertAfter(this.marker, parseHTML(this.output));
    }
  }

  observe() {
    var {isArray, isObject} = this.Handlebars.Utils;

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
    if (this.observer) {
      this.observer.close();
    }
  }
}

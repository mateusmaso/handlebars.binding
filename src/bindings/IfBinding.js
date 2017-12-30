import {
  ArrayObserver,
  PathObserver
} from "observe-js";

import Binding from './binding';

export default class IfBinding extends Binding {
  constructor(Handlebars, context, keypath, value, options) {
    var {isFalsy} = Handlebars.Utils;
    super(Handlebars, context, keypath, value, options);
    this.falsy = isFalsy(value);
  }

  initialize() {
    if (this.options.hash.bind) {
      return super.initialize();
    } else {
      return this.runOutput();
    }
  }

  observe() {
    var {isArray, isFalsy} = this.Handlebars.Utils;

    if (isArray(this.value)) {
      this.setObserver(new ArrayObserver(this.value));
      this.observer.open(() => {
        if (isFalsy(this.value) != this.falsy) {
          this.falsy = isFalsy(this.value);
          this.render();
        }
      });
    } else {
      this.setObserver(new PathObserver(this.context, this.keypath));
      this.observer.open((value) => {
        this.value = value;
        if (isFalsy(this.value) != this.falsy) {
          this.falsy = isFalsy(this.value);
          this.render();
        }
      });
    }
  }

  runOutput() {
    if (this.falsy) {
      return this.setOutput(this.options.inverse ? this.options.inverse(this.context) : this.options.hash.else);
    } else {
      return this.setOutput(this.options.fn ? this.options.fn(this.context) : this.options.hash.then);
    }
  }

  renderAttribute(options={}) {
    var {removeClass, addClass} = this.Handlebars.Utils;

    if (this.options.hash.attr == true) {
      this.node.removeAttribute(this.previousOutput);
      if (this.output) this.node.setAttribute(this.output, "");
    } else if (this.options.hash.attr == "class") {
      removeClass(this.node, this.previousOutput);
      addClass(this.node, this.output);
    } else {
      this.node.setAttribute(this.options.hash.attr, this.output);
    }
  }
}

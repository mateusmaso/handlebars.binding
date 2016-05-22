import {
  ArrayObserver,
  PathObserver
} from "observe-js";

import Binding from './binding';
import deps, {getUtils} from "../deps";

import {
  isFalsy,
  addClass,
  removeClass
} from '../utils';

export default class IfBinding extends Binding {
  constructor(context, keypath, value, options) {
    super(context, keypath, value, options);
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
    if (getUtils().isArray(this.value)) {
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

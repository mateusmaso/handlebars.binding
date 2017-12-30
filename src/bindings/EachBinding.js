import {
  ArrayObserver,
  ObjectObserver
} from "observe-js";

import Binding from './binding';

class ItemBinding extends Binding {
  initialize() {
    if (this.options.hash.bind) {
      return super.initialize();
    } else {
      return this.runOutput();
    }
  }

  runOutput() {
    var {isObject, extend} = this.Handlebars.Utils;

    if (this.options.hash.var) {
      this.context[this.options.hash.var] = this.value;
    } else if (isObject(this.value)) {
      Object.assign(this.context, this.value);
    }

    return this.setOutput(this.options.fn(this.context));
  }

  observe() {
    var {isObject, extend} = this.Handlebars.Utils;

    this.parentContextObserver = new ObjectObserver(this.options.hash.parentContext);
    this.parentContextObserver.open(() => {
      Object.assign(this.context, this.options.hash.parentContext)
    });

    if (isObject(this.value)) {
      if (!this.options.hash.var) {
        this.setObserver(new ObjectObserver(this.value));
        this.observer.open(() => Object.assign(this.context, this.value));
      }
    }
  }
}

export default class EachBinding extends Binding {
  constructor(Handlebars, context, keypath, value, options) {
    super(Handlebars, context, keypath, value, options);
    this.itemBindings = [];
    this.empty = value.length == 0;
    this.options.hash.parentContext = this.context;
  }

  initialize() {
    if (this.options.hash.bind) {
      return super.initialize();
    } else {
      return this.runOutput();
    }
  }

  observe() {
    this.setObserver(new ArrayObserver(this.value));
    this.observer.open((splices) => {
      splices.forEach((splice) => {
        this.empty = this.value.length == 0;
        this.render({splice: splice});
      });

      this.value.forEach((item, index) => {
        this.itemBindings[index].context.index = index;
      });
    });
  }

  runOutput() {
    var {extend} = this.Handlebars.Utils;
    var output = "";
    this.itemBindings = [];

    this.value.forEach((item, index) => {
      var itemContext = Object.assign({index: index, "$this": item}, this.context);
      var itemBinding = new ItemBinding(this.Handlebars, itemContext, null, item, this.options);
      this.itemBindings.push(itemBinding);
      output += itemBinding.initialize();
    });

    return this.setOutput(this.empty ? this.options.inverse(this.context) : output);
  }

  render(options={}) {
    if (options.splice) {
      var splice = options.splice;

      if (splice.removed.length > 0) {
        var removedCount = 0
        for (let index = splice.index; index < (splice.index + splice.removed.length); index++) {
          this.removeItem(index - removedCount++);
        }
      }

      if (splice.addedCount > 0) {
        for (let index = splice.index; index < (splice.index + splice.addedCount); index++) {
          this.addItem(index);
        }
      }
    } else {
      return super.render(options);
    }
  }

  addItem(index) {
    var {parseHTML} = this.Handlebars;
    var {extend, insertAfter} = this.Handlebars.Utils;
    var previous;

    if (this.itemBindings[index - 1]) {
      previous = this.itemBindings[index - 1].delimiter;
    } else {
      previous = this.marker;
    }

    var item = this.value[index];
    var itemContext = Object.assign({index: index, "$this": item}, this.context);
    var itemBinding = new ItemBinding(this.Handlebars, itemContext, null, item, this.options);
    insertAfter(previous, parseHTML(itemBinding.initialize()));
    this.itemBindings.splice(index, 0, itemBinding);
  }

  removeItem(index) {
    var {unbind} = this.Handlebars;
    var {removeBetween} = this.Handlebars.Utils;
    var itemBinding = this.itemBindings[index];
    removeBetween(itemBinding.marker, itemBinding.delimiter).forEach((node) => unbind(node));
    itemBinding.marker.remove();
    itemBinding.delimiter.remove();
    this.itemBindings.splice(index, 1);
  }
}

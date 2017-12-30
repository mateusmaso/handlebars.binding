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
    if (this.options.hash.var) {
      this.context[this.options.hash.var] = this.value;
    } else if (this.Handlebars.Utils.isObject(this.value)) {
      this.Handlebars.Utils.extend(this.context, this.value);
    }

    return this.setOutput(this.options.fn(this.context));
  }

  observe() {
    this.parentContextObserver = new ObjectObserver(this.options.hash.parentContext);
    this.parentContextObserver.open(() => {
      this.Handlebars.Utils.extend(this.context, this.options.hash.parentContext)
    });

    if (this.Handlebars.Utils.isObject(this.value)) {
      if (!this.options.hash.var) {
        this.setObserver(new ObjectObserver(this.value));
        this.observer.open(() => this.Handlebars.Utils.extend(this.context, this.value));
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
    var output = "";
    this.itemBindings = [];

    this.value.forEach((item, index) => {
      var itemBinding = new ItemBinding(this.Handlebars, this.Handlebars.Utils.extend({index: index, "$this": item}, this.context), null, item, this.options);
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
    var previous;

    if (this.itemBindings[index - 1]) {
      previous = this.itemBindings[index - 1].delimiter;
    } else {
      previous = this.marker;
    }

    var item = this.value[index];
    var itemBinding = new ItemBinding(this.Handlebars, this.Handlebars.Utils.extend({index: index, "$this": item}, this.context), null, item, this.options);
    this.Handlebars.Utils.insertAfter(previous, this.Handlebars.parseHTML(itemBinding.initialize()));
    this.itemBindings.splice(index, 0, itemBinding);
  }

  removeItem(index) {
    var itemBinding = this.itemBindings[index];
    this.Handlebars.Utils.removeBetween(itemBinding.marker, itemBinding.delimiter).forEach((node) => this.Handlebars.unbind(node));
    itemBinding.marker.remove();
    itemBinding.delimiter.remove();
    this.itemBindings.splice(index, 1);
  }
}

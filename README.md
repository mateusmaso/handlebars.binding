handlebars.binding [![Build Status](https://travis-ci.org/mateusmaso/handlebars.binding.svg?branch=master)](https://travis-ci.org/mateusmaso/handlebars.binding)
==================

This library is an extension for Handlebars which allows using data binding on pre-existing templates. Yet, it offers a simple and powerful way of building highly interactive templates without re-rendering or updating DOM manually.

## Features

* Clean markup.
* One-way data binding.
* New ```bind``` helper method.
* Support for blocks, attributes and inline binding.
* Now ```each```, ```if``` and ```unless``` allows binding.
* Optional use and works on pre-existing handlebars templates.

## Dependencies

* observe.js (>= 0.4.0)
* handlebars.js (>= 1.1.0)
  * handlebars.element.js (>= 0.1.2)

## Node

```javascript
var Handlebars = global.Handlebars = require("handlebars");
require("handlebars.element");
require("handlebars.binding");
```

## Usage

When including the library, make sure to import all the dependencies in the same order as listed before. Once made it, do not forget to parse the rendered string HTML from your template's method and notify any changes by calling the ```performMicrotaskCheckpoint``` if needed.

```javascript
var context = {foo: 123};
var template = Handlebars.templates["path/to/your/template"];
var nodes = Handlebars.parseHTML(template(context));

context.foo = 321;

Platform.performMicrotaskCheckpoint(); // older browsers support
```

## Examples

### Bind helper

```html
<h1>{{bind "foo"}}</h1>

<h1 {{bind "foo" attr=true}}>
  Hello {{foo}}, {{bar}}
</h1>

<h1 {{bind "foo" attr="class"}}>
  Hello {{foo}}, {{bar}}
</h1>

{{#bind "foo"}}
  <h1>Hello {{foo}}, {{bar}}</h1>
{{/bind}}
```

### If and Unless helper

```html
<h1>{{if "foo" bind=true then="Hello" else="World"}}</h1>

<h1 {{if "foo" bindAttr=true then="disabled" else="enabled"}}>
  Hello {{foo}}, {{bar}}
</h1>

<h1 {{if "foo" bindAttr="class" then="hello" else="goodbye"}}>
  Hello {{foo}}, {{bar}}
</h1>

{{#if "foo" bind=true}}
  <h1>Hello {{foo}}, {{bar}}</h1>
{{else}}
  <h1>Goodbye</h1>
{{/if}}
```

### Each helper

```html
{{#each collection var="item" bind=true}}
  <h2>Item {{index}}: {{item}}</h2>
  <p>{{item.content}}</p>
{{/each}}
```

## License

Copyright (c) 2013-2014 Mateus Maso. Released under an MIT license.

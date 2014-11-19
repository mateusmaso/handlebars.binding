handlebars.binding [![Build Status](https://travis-ci.org/mateusmaso/handlebars.binding.svg?branch=master)](https://travis-ci.org/mateusmaso/handlebars.binding)
==================

This library is an extension for Handlebars which allows using data binding on existing templates. At the same time, it offers a simple and powerful way to solve this big gap while building highly interactive templates.

## Features

* Clean markup.
* One-way data binding.
* New ```bind``` helper method.
* Support for block, attribute and inline binding.
* ```each```, ```if``` and ```unless``` helper enhancement.
* Optional use and works with existing handlebars templates.

## Dependencies

* observe.js
* handlebars.js (>= 1.0)
  * handlebars.element.js

## Usage

Before including the library, make sure to import all the dependencies in the same order as listed in the section above. Once made that, don't forget to parse the rendered HTML from your template function and notify any changes by calling the method ```performMicrotaskCheckpoint```.

```javascript
var context = {foo: 123};
var template = Handlebars.templates["path/to/your/template"];
var nodes = Handlebars.parseHTML(template(context));

context.foo = 321;

Platform.performMicrotaskCheckpoint();
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

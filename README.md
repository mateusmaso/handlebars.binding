handlebars.binding [![Build Status](https://travis-ci.org/mateusmaso/handlebars.binding.svg?branch=master)](https://travis-ci.org/mateusmaso/handlebars.binding)
==================

This is a Handlebars plugin which allows using one-way data binding inside templates with a clean markup. It saves development time by offering a simple and powerful way of building highly interactive templates without re-rendering or updating the DOM manually.

## Install

```
$ npm install --save handlebars.binding
```

## Usage

```javascript
var Handlebars = require("handlebars");
require("handlebars.binding").default(Handlebars);

var main = document.querySelector("main");
var context = {foo: 123};
var template = Handlebars.templates["path/to/template"];
var nodes = Handlebars.parseHTML(template(context));

nodes.forEach((node) => main.appendChild(node));

context.foo = 321;

Handlebars.update();
```

## Examples

### Binding with ```bind``` helper

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

### Binding with ```if``` and ```unless``` helper

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

### Binding with ```each``` helper

```html
{{#each objects var="object" bind=true}}
  <h2>Item {{index}}: {{object.name}}</h2>
  <p>{{object.content}}</p>
{{/each}}

{{#each objects bind=true}}
  <h2>Item {{index}}: {{name}}</h2>
  <p>{{content}}</p>
{{/each}}

{{#each primitives var="primitive" bind=true}}
  <h2>Item {{index}}: {{primitive}}</h2>
{{/each}}

{{#each primitives bind=true}}
  <h2>Item {{index}}: {{$this}}</h2>
{{/each}}
```

### Unbinding and rebinding DOM

```javascript
Handlebars.unbind(node);
Handlebars.bind(node);
```

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)

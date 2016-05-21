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

* observe.js
* handlebars.js
* handlebars.element.js

## Node

```javascript
var Observe = require("observe-js");
var Handlebars = require("handlebars");
require("handlebars.element").default(Handlebars);
require("handlebars.binding").default(Handlebars, Observe, Platform);
```

## ES6

```javascript
import Observe from "observe-js";
import Handlebars from "handlebars";
import HandlebarsElement from "handlebars.element";
import HandlebarsBinding from "handlebars.binding";
HandlebarsBinding(HandlebarsElement(Handlebars, Observe, Platform));
```

## Usage

```javascript
var context = {foo: 123};
var template = Handlebars.templates["path/to/your/template"];
var nodes = Handlebars.parseHTML(template(context));
context.foo = 321;
Handlebars.update();
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

### Unbind and Bind methods

```javascript
Handlebars.unbind(node);
Handlebars.bind(node);
```

## License

Copyright (c) 2013 Mateus Maso. Released under an MIT license.

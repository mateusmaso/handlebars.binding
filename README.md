handlebars.binding
==================

This library is an extension for Handlebars which allows using data binding on existing templates. At the same time, it offers a simple and powerful way to solve this big gap when building high interactivity templates.

## Features

* One-way data binding
* New ```bind``` helper method
* ```each```, ```if``` and ```unless``` helper enhancement
* Support for block, attribute and inline binding
* Optional use and works with existing handlebars templates

## Dependencies

* observe.js
* handlebars.js (>= 1.0)
  * handlebars.element.js

## Usage

Before including the library, make sure that you imported the dependencies in the same order as the section above shows up. Once made that, don't forget to parse the rendered HTML from your template function and notify any changes made using the method ```performMicrotaskCheckpoint```.

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

{{#each sortableCollection var="item" bind=true single=true}}
  <div class="sortable-class">
    <h2>Item {{index}}: {{item}}</h2>
    <p>{{item.content}}</p>
  </div>
{{/each}}
```

## License

Copyright (c) 2013-2014 Mateus Maso. Released under an MIT license.

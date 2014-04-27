handlebars.binding
==================

This library is an extension of Handlebars which allows the choice of using data binding on existing templates. At the same time, it tries to give a powerful way with simple expressions to solve this big gap while building high interactivity templates.

## Features

* One-way data-binding
* If and Unless helper enhancement
* Support for block, attribute and inline binding
* Optional use and works with existing handlebars templates

## Dependencies

* observe.js
* handlebars.js (>= 1.0)
  * handlebars.element.js

## Bind helper

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

## If and Unless helper

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

## Each helper

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

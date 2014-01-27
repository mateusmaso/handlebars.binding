handlebars.binding
==================

## Bind helper
```
{{bind "foo"}}

{{#bind "foo"}}
  <h1>Hello {{foo}}, {{bar}}</h1>
{{/bind}}
```

## If and Unless helper bind argument
```
{{if "foo" bind=true then="Hello" else="World"}}

{{#if "foo" bind=true}}
  <h1>Hello {{foo}}, {{bar}}</h1>
{{else}}
  <h1>Goodbye</h1>
{{/if}}
```

## Each helper bind argument
```
{{#each collection var="item" bind=true}}
  <h2>Item {{index}}: {{item}}</h2>
{{/each}}
```

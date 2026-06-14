# josephus-snippet



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type          | Default                       |
| -------- | --------- | ----------- | ------------- | ----------------------------- |
| `data`   | `data`    |             | `string`      | `undefined`                   |
| `href`   | `href`    |             | `string`      | `undefined`                   |
| `repr`   | --        |             | `ScoreRepr[]` | `['label', 'audio', 'score']` |


## Dependencies

### Used by

 - [josephus-task](../josephus-task)

### Depends on

- [josephus-audio](../josephus-audio)

### Graph
```mermaid
graph TD;
  josephus-snippet --> josephus-audio
  josephus-task --> josephus-snippet
  style josephus-snippet fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

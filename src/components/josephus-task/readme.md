# josephus-task



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                            | Default     |
| -------- | --------- | ----------- | ----------------------------------------------- | ----------- |
| `count`  | `count`   |             | `number`                                        | `0`         |
| `spec`   | --        |             | `{ scores: ScoreSpec[]; fields: FieldSpec[]; }` | `undefined` |


## Events

| Event                   | Description | Type                                                |
| ----------------------- | ----------- | --------------------------------------------------- |
| `josephus-task-loading` |             | `CustomEvent<{ state: JosephusTaskLoadingState; }>` |


## Dependencies

### Used by

 - [josephus-challenge](../josephus-challenge)

### Depends on

- [josephus-field](../josephus-field)

### Graph
```mermaid
graph TD;
  josephus-task --> josephus-field
  josephus-field --> josephus-snippet
  josephus-snippet --> josephus-audio
  josephus-challenge --> josephus-task
  style josephus-task fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# josephus-challenge



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                     | Default     |
| -------- | --------- | ----------- | ------------------------ | ----------- |
| `spec`   | --        |             | `{ tasks: TaskSpec[]; }` | `undefined` |


## Dependencies

### Used by

 - [josephus-exam](../josephus-exam)

### Depends on

- [josephus-timer](../josephus-timer)
- [josephus-task](../josephus-task)

### Graph
```mermaid
graph TD;
  josephus-challenge --> josephus-timer
  josephus-challenge --> josephus-task
  josephus-task --> josephus-field
  josephus-field --> josephus-snippet
  josephus-snippet --> josephus-audio
  josephus-exam --> josephus-challenge
  style josephus-challenge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

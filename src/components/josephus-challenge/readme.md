# josephus-challenge



<!-- Auto Generated Below -->


## Methods

### `load(spec: ChallengeSpec) => Promise<void>`



#### Parameters

| Name   | Type                     | Description |
| ------ | ------------------------ | ----------- |
| `spec` | `{ tasks: TaskSpec[]; }` |             |

#### Returns

Type: `Promise<void>`




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
  josephus-task --> josephus-snippet
  josephus-snippet --> josephus-audio
  josephus-exam --> josephus-challenge
  style josephus-challenge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

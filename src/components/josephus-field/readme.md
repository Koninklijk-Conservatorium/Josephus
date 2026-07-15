# josephus-field



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                                                                                                                                                       | Default     |
| -------- | --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `scores` | --        |             | `StringMEI[][]`                                                                                                                                                                            | `[]`        |
| `spec`   | --        |             | `{ type: FieldType; scoreRefs: number[]; transforms: TransformSpec[]; repr: ScoreRepr[]; layout?: ScoreLayout; gui: JosephusGUI; items: number; events?: string[]; description: string; }` | `undefined` |


## Dependencies

### Used by

 - [josephus-task](../josephus-task)

### Depends on

- [josephus-snippet](../josephus-snippet)

### Graph
```mermaid
graph TD;
  josephus-field --> josephus-snippet
  josephus-snippet --> josephus-audio
  josephus-task --> josephus-field
  style josephus-field fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

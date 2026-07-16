# josephus-snippet



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type                                                                                                                                                                                                                                                                                                     | Default                                                                                                                                                              |
| -------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`         | `data`    |             | `string`                                                                                                                                                                                                                                                                                                 | `null`                                                                                                                                                               |
| `href`         | `href`    |             | `string`                                                                                                                                                                                                                                                                                                 | `null`                                                                                                                                                               |
| `repr`         | --        |             | `ScoreRepr[]`                                                                                                                                                                                                                                                                                            | `['label', 'audio', 'score']`                                                                                                                                        |
| `scoreOptions` | --        |             | `VerovioOptions`                                                                                                                                                                                                                                                                                         | `{     adjustPageHeight: true,     adjustPageWidth: true,     scale: 30,     scaleToPageSize: false,     footer: 'none',     header: 'none',     breaks: "none"   }` |
| `select`       | --        |             | `{ measureRange: { measureRange: VerovioMeasureRange; } \| { start: string; end: string; }; eventRange?: { start: string & Spec<"MEINoteID", "xml:id">; end: string & Spec<"MEINoteID", "xml:id">; }; } & MEI & Verovio & EMA & { futureMilestone?: "This functionality should be converted to EMA."; }` | `{ measureRange: { measureRange: 'start-end' } }`                                                                                                                    |


## Dependencies

### Used by

 - [josephus-field](../josephus-field)

### Depends on

- [josephus-audio](../josephus-audio)

### Graph
```mermaid
graph TD;
  josephus-snippet --> josephus-audio
  josephus-field --> josephus-snippet
  style josephus-snippet fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

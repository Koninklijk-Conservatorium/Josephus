type ExtractorSpec = {
  type: "extractor"
  feature: 'pitches'
  unique: boolean,
  // order?: 'ascending' | 'descending'
}

type FilterSpec = {
  type: "filter"
  feature: 'accidentals' | /* 'articulations' | */ 'pitches' | 'durations'
}

type SegmenterSpec = {
  type: "segmenter"
  feature: "brackets" //'fermata' | 'rests' | 'pitches'
}

type SelectorSpec = {
  type: "selector",
  feature: never //"pitch"
}

type TransformSpec = ExtractorSpec | FilterSpec | SegmenterSpec | SelectorSpec

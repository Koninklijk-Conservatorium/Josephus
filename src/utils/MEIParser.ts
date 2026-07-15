import { MEIPitchExtractor } from "./MEIExtractor"
import { MEIAccidentalsFilter, MEIDurationsFilter, MEIPitchesFilter } from "./MEIFilter"
import { type MEITransformClass } from "./MEITransform"

type MEITransformClasses = {
  [T in TransformSpec["type"]]: Record<
    Extract<TransformSpec, { type: T }>["feature"],
    new (spec: Extract<TransformSpec, { type: T }>) => MEITransformClass
  >
}

const TRANSFORMS: MEITransformClasses = {
  extractor: {
    "pitches": MEIPitchExtractor
  },
  filter: {
    "accidentals": MEIAccidentalsFilter,
    // "articulations": filter.articulations,
    "durations": MEIDurationsFilter,
    "pitches": MEIPitchesFilter
  },
  segmenter: {
    // "pitches": segmenter.pitches,
    // "fermata": segmenter.fermata,
    // "rests": segmenter.rests
  },
  selector: {
    // "pitch": selector.pitch
  }
}


export class MEIParser extends DOMParser {

  constructor(private transforms: TransformSpec[]) { super() }

  override parseFromString(string: StringMEI, type: DOMParserSupportedType = "application/xml"): MEIDocument {
    const mei = super.parseFromString(string, type)
    for (let transformSpec of this.transforms) {
      const transformType = TRANSFORMS[transformSpec.type]
      if (transformSpec.feature in transformType) {
        const Transform = transformType[transformSpec.feature] as new(...arg: any[]) => MEITransformClass
        const transform = new Transform(transformSpec)
        transform.transform(mei)
      }
    }
    return mei
  }

}

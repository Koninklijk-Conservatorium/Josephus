/*
    Utilities
*/
type Spec<Name, Description> = {
  lib?: Name,
  desc?: Description
}
type FutureMilestoneSpec<Spec, Explanation> = Spec & { futureMilestone?: Explanation}

/*
    Specification brands
*/
type MEI = Spec<'MEI', 'Music Encoding Intiative'>
type EMA = Spec<'EMA', "Enhancing Music notation Adressability">
type Verovio = Spec<'Verovio', 'Derivet from documentation of Verovio'>

/**
 * A more precise type for Verovio's 'select' interface.
 * See also: 'Selection' type in Verovio's index.d.ts.
 */
type VerovioMeasureRange = `${number|"start"}-${number|"end"}` & Verovio /* | { start: string, end: string } */ & Verovio

// TO DO: type it FINALLY better.
type SelectionMEI = ({
  measureRange: {
    measureRange: VerovioMeasureRange,
  } | {
    start: string,
    end: string
  }

  eventRange?: {
    start: string & Spec<'MEINoteID', 'xml:id'>
    end: string & Spec<'MEINoteID', 'xml:id'>
  }
}) & MEI & Verovio & FutureMilestoneSpec<EMA, "This functionality should be converted to EMA.">

/**
 * MEI-branded data types.
 */
type StringMEI = string & MEI
type MEIDocument = XMLDocument & { selections: SelectionMEI[] } & MEI

/**
 * Score information retrieved from spec.
 */
type ScoreData = {
  spec: ScoreSpec,
  mei: StringMEI,
  segments: SelectionMEI[]
}

/**
 * "Distilled" score information for snippet display.
 */
type Snippet = {
  mei: StringMEI,
  segment: SelectionMEI
}

interface MEINoteElement extends Element {
  tagName: 'note';
}
// TO DO: port from MEI itself!
// TO DO: add more.

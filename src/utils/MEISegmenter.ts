import { MEITransform } from "./MEITransform";

/*
  NOTE on segmenting MEI files.
  MEI files have their own api for retrieving file selections
  "Enhancing Music Addressability for MEI"

  https://github.com/music-addressability/ema-for-mei

  This is however and old codebase.

  For now, I'll use tools available in Verovio:
  * simplified 'selection' API for retrieving measures
  * tracking events "sounding" in selection using Timemap.
*/

abstract class MEISegmenter extends MEITransform {

  abstract segmentate(mei: MEIDocument): SelectionMEI[]

  applySelection(mei:MEIDocument, selection: SelectionMEI): MEIDocument {

    /*
      For now, apply only measureRange by filtering measures.
      (see: FutureMilestoneSpec)
    */
    if ("measureRange" in selection.measureRange) {
      console.warn('Segmenter: segmenting on measureRange string not yet supported.')
      return mei
    }
    const getN = (measureId:string) => this.select(`//mei:measure[@xml:id=${measureId}]/@n`, mei)[0]
    const start = Number(getN(selection.measureRange.start!))
    const end = Number(getN(selection.measureRange.end!))

    const copy = mei.cloneNode(true) as MEIDocument
    this.select(`//mei:measure[@n<'${start}']`, copy).forEach(measure => {
      measure.parentNode?.removeChild(measure)
    })
    this.select(`//mei:measure[@n>'${end}']`, copy).forEach(measure => {
      measure.parentNode?.removeChild(measure)
    })

    // TO DO like this:
    // const measures = this.select(`//mei:measure[@n<=${start} and @n>=${end}]`)

    return copy
  }

}


export class MEIBracketsSegmenter extends MEISegmenter {
  constructor() { super() }

  segmentate(mei: MEIDocument): SelectionMEI[] {

    const dummyRange: SelectionMEI = {
      measureRange: {
        measureRange: "start-end"
      }
    }

    const segments = this.select("//mei:bracketSpan", mei).map(bracket => {

      const startID = bracket.getAttribute('startid')?.slice(1) /* Needs to remove '#'. */
      const endID = bracket.getAttribute('endid')?.slice(1)
      if (!startID || !endID) return dummyRange

      const startMeasureID = this.select(`//*[@xml:id='${startID}']/ancestor-or-self::mei:measure`, mei)?.[0].getAttribute("xml:id") // beware: null -> 0.
      const endMeasureID = this.select(`//*[@xml:id='${endID}']/ancestor-or-self::mei:measure`, mei)?.[0].getAttribute("xml:id")
      if (!startMeasureID || !endMeasureID) return dummyRange

      return {
        eventRange: {
          start: startID,
          end: endID
        },
        measureRange: {
          start: startMeasureID,
          end: endMeasureID
        }
      }
    })

    return segments
  }

  transform(mei: MEIDocument): MEIDocument {
    mei.selections = this.segmentate(mei)
    return mei
  }
}


// get chordsWithFermata(): MEIDocument {
//   const verovio = window.josephus ? new window.josephus.verovio.toolkit() : undefined; // BAD AS HELL!!!
//   if (!verovio) {
//     console.warn('Verovio not loaded.')
//     return MEIDocument.parse('')
//   }
//   const score = MEIDocument.serializer.serializeToString(this);
//   verovio.loadData(score);

//   const fermataTimes = new Set<number>();
//   const fermatas = this.find('//mei:fermata');
//   this.iter(fermatas, fermata => {
//     const noteId = fermata.getAttribute('startid') ?? '';
//     if (!noteId) return;
//     const time = verovio.getTimesForElement(noteId.slice(1));
//     const scoreTimeOffset = time.scoreTimeOffset;
//     // fermataTimes.add(time.tstampOn[0]);
//     fermataTimes.add(scoreTimeOffset);
//   });

//   const chords: MEINoteElement[][] = [];
//   for (let tstamp of fermataTimes) {
//     const els = verovio?.getElementsAtTime(tstamp);
//     const chord: MEINoteElement[] = [];
//     for (let noteId of els.notes) {
//       const notes = this.find(`//mei:note[@xml:id='${noteId}']`);
//       this.iter(notes, note => chord.push(note as MEINoteElement));
//     }
//     chords.push(chord);
//   }

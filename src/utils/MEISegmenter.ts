// abstract class MEISegmenter extends MEITransformer {
//   pitches(mei: MEIDocument) { return mei } // [mei]
//   fermata(mei: MEIDocument) { return mei } // [mei]
//   rests(mei: MEIDocument) { return mei } // [mei]
// }



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

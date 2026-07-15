// import { MEIDocument } from './mei';
// import * as mei from './mei-tools';

// interface ScoreTemplate {
//   source: '';
// }

// interface PitchTemplate extends ScoreTemplate, mei.MEIPitchAttributes {
//   entity: 'pitch';
//   oct: mei.MEIOctave;
//   pname: mei.MEIPitchName;
//   accid: mei.MEIAccidentalBasic;
// }

// interface ChordTemplate extends ScoreTemplate {
//   entity: 'chord';
//   root: PitchTemplate;
//   class: 'augmented';
//   inversion: number; // 1,
//   voicing: number[]; //[0, 2, 1]
// }

// export class MEITemplate extends MEIDocument {
//   constructor(spec: ScoreTemplate) {
//     super();
//     this.createElement('chord');
//     const rootPitch: mei.Pitch = spec.root;
//     const root = mei.createNote(rootPitch);
//     const notes = [];
//   }
// }

// // {
// //   "source": "",
// //   "entity": "chord",
// //   "root": "3fs",
// //   "class": "augmented",
// //   "inversion": 1,
// //   "voicing": [0, 2, 1]
// // }

// const xml = '<chord><note oct="$oct1" pname="$pname1"/></chord>/>'
// const schema = parse(xml)
// schema.oct: MEIOctave
// schema.pname: MEIPitchClass

// const chord = chordTemplate(p1)

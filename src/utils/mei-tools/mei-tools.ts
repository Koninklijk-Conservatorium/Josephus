// IMPORTANT: I'm splitting this file into two repos:
// 1) @types/mei

/**
 * Copy of MEI data.PITCHNAME
 */
export type MEIPitchName = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b'; // [a-g]
/**
 * Copy of MEI data.PITCHCLASS
 */
export type MEIPitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
/**
 * Copy of MEI data.OCTAVE
 */
export type MEIOctave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Copy of MEI data.ACCIDENTAL.WRITTEN.basic
 */
export type MEIAccidentalBasic = 's' | 'f' | 'ss' | 'x' | 'ff' | 'xs' | 'sx' | 'ts' | 'tf' | 'n' | 'nf' | 'ns';
export type MEIAccidModAllowed = -3 | -2 | -1 | 0 | 1 | 2 | 3; // Utility.
/**
 * A quick but full encoding of pitch: Octave, Pname, Accidental.
 * Only Pname is compulsory, the rest is optional.
 */
export type Pitch = `${MEIOctave}${MEIPitchName}${MEIAccidentalBasic | ''}`;

/**
 * An interval expressed as an absolute symbolic distance between two pitches.
 * TO DO: should be positive only (where '1' is prime).
 * See MEI data.INTERVAL.HARMONIC
 */
export type MEIDiatonicIntervalClass = number; // Minumum: 1.
export type MEIDiatonicIntervalClassWrapped = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Any interval expressed as distance in semitones.
 */
export type Interval = number;
/**
 * Interval quality. See MEI data.INTERVAL.HARMONIC
 */
export type MEIIntervalQuality = 'A' | 'd' | 'M' | 'm' | 'P';

// Extending with transposition interval encoding coming from Verovio.
export type VerovioOctaveHigher = '+' | '++' | '+++' | '++++' | '+++++' | '++++++' | '+++++++' | '++++++++' | '+++++++++';
export type VerovioOctaveLower = '-' | '--' | '---' | '----' | '-----' | '------' | '-------' | '--------' | '---------';
export type VerovioIntervalOctave = '' | VerovioOctaveHigher | VerovioOctaveLower;
export type VerovioIntervalQuality = MEIIntervalQuality | 'AA' | 'dd';

/**
 * Approximation of MEI data.INTERVAL.HARMONIC
 * MEI definition is a RegExp pattern: [AdMmP][1-9][0-9]*
 */
export type MEIHarmonicInterval = `${MEIIntervalQuality}${number}`;
export type VerovioTransposition = `${VerovioIntervalOctave}${VerovioIntervalQuality}${MEIDiatonicIntervalClass}`;

/**
 * Copy of MEI data.DURATION.cmn
 */
export type MEIDuration = 'long' | 'breve' | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export const pitches: readonly MEIPitchName[] = ['c', 'd', 'e', 'f', 'g', 'a', 'b'] as const;
export const diatonics: Record<MEIPitchName, MEIPitchClass> = {
  c: 0,
  d: 2,
  e: 4,
  f: 5,
  g: 7,
  a: 9,
  b: 11,
};

export const accids: Record<MEIAccidentalBasic, Interval> = { s: 1, f: -1, ss: 2, x: 2, ff: -2, xs: 3, sx: 3, ts: 3, tf: -3, n: 0, nf: -1, ns: 1 };
export const intervals: Record<MEIDiatonicIntervalClassWrapped, Interval> = {
  1: 0,
  2: 2,
  3: 4,
  4: 5,
  5: 7,
  6: 9,
  7: 10,
};
export const intervalQualityMEI: Record<MEIIntervalQuality, Interval> = { A: 1, d: -1, M: 0, m: -1, P: 0 };

export const intervalQualityVerovio: Record<VerovioIntervalQuality, Interval> = { ...intervalQualityMEI, AA: 2, dd: -2 };

/**
 * Attributes needed for description of pitch.
 * TO DO: gestural.
 */
export interface MEIPitchAttributes {
  oct: MEIOctave;
  pname: MEIPitchName;
  accid?: MEIAccidentalBasic;
}
/**
 * Inspired by MEI <note>
 */
export interface MEINoteAttributes extends Partial<MEIPitchAttributes>, NamedNodeMap {
  dur?: MEIDuration;
}

export interface MEINote extends Element {
  // tagName: 'note';
  attributes: MEINoteAttributes;
  // children: never;
}

function createNoteFromPitch(pitch: Pitch) {
  const [_, o, p, a] = pitch.match(/^([1-9][0-9]*)([a-g])(\w*)$/) ?? [null, null, null, null];
  if (!(o && p)) {
    throw new Error(`Cannot parse pitch: ${pitch}`);
  }
  const note: MEINote = document.createElement('note'); // TO DO: add namespace and change to createElementNS
  note.setAttribute('oct', o);
  note.setAttribute('pname', p);
  if (a) note.setAttribute('accid', a);
  return note;
}

function createNoteFromAttrs(attrs: MEIPitchAttributes) {
  const note: MEINote = document.createElement('note'); // TO DO: add namespace and change to createElementNS
  note.setAttribute('oct', attrs.oct.toString());
  note.setAttribute('pname', attrs.pname);
  if (attrs.accid) note.setAttribute('accid', attrs.accid);
  return note;
}

export function createNote(pitchOrAttrs: Pitch | MEIPitchAttributes): MEINote {
  if (typeof pitchOrAttrs === 'string') {
    return createNoteFromPitch(pitchOrAttrs);
  }
  return createNoteFromAttrs(pitchOrAttrs);
}

export function getPitch(note: MEINote): MEIPitchAttributes {
  return {
    oct: Number(note.getAttribute('oct')) as MEIOctave,
    pname: note.getAttribute('pname') as MEIPitchName,
    accid: (note.getAttribute('accid') as MEIAccidentalBasic) ?? null,
  };
}

// Some helpers for transpose.
type NoteTransposable = MEINote | MEIPitchAttributes | Pitch;
const accidPrimitiveLookup: Record<MEIAccidModAllowed, MEIAccidentalBasic> = {
  '-3': 'tf',
  '-2': 'ff',
  '-1': 'f',
  0: 'n',
  1: 's',
  2: 'x',
  3: 'sx',
};
/**
 * Transpose a single note and return a new note.
 * Note: for more advance transpotition of MEI files use Verovio's transpotion option.
 * @param note
 * @param transposition
 * @returns
 */
export function transpose(note: NoteTransposable, transposition: VerovioTransposition): NoteTransposable {
  // export function transpose<N extends NoteTransposable>(note: N, transposition: VerovioTransposition): N {
  type AccidMod = number;
  type NoteDestructed = [MEIOctave, MEIPitchName, AccidMod];
  type DestructTransposition = [VerovioIntervalOctave | null, VerovioIntervalQuality | null, MEIDiatonicIntervalClass | null];
  function handleNote(note: NoteTransposable): NoteDestructed {
    if (typeof note === 'string') note = createNote(note);
    if (note instanceof Element) note = getPitch(note);
    if (!(note.oct && note.pname)) {
      throw new Error(`Note without octave or pname cannot be transposed: ${note}`);
    }
    return [note.oct, note.pname, note.accid ? accids[note.accid] : 0];
  }
  function handleVerovioOctave(octave: string | null): { dir: 1 | -1; mod: number } {
    return {
      dir: octave ? (octave.match(/\++/) ? 1 : -1) : 1, // Well... doesn't matches for '-' explicitly.,
      mod: octave ? octave.length - 1 : 0,
    };
  }
  function handleTransposition(transposition: VerovioTransposition): {
    dir: 1 | -1;
    oct: number;
    quality: VerovioIntervalQuality;
    diatonicSteps: MEIDiatonicIntervalClass;
  } | void {
    const [_, o, q, i] = (transposition.match(/^(\+*|-*)(AA?|dd?|M|m|P)(\d+)/) ?? [null, null, null, null]) as [null, ...DestructTransposition];
    if (!(q && i)) {
      throw new Error(`Incorrect interval, cannot transpose: ${transposition}`);
    }
    const octaveData = handleVerovioOctave(o);
    const interval: Interval = Number(i ?? 1) - 1;
    return {
      dir: octaveData.dir,
      oct: octaveData.mod,
      quality: q,
      diatonicSteps: interval,
    };
  }

  const [octaveOld, pnameOld, accidOld] = handleNote(note);
  const transData = handleTransposition(transposition);
  if (!transData) {
    throw new Error(`Cannot transpose MEI note ${note} by interval ${transposition}`);
  }

  /**
   * Modulo operation wrapping around 0.
   * @param n value
   * @param m modulo
   * @returns value wrapped in (0, m).
   */
  const modulo = (n: number, m: number) => ((n % m) + m) % m;

  const diatonicStep: number = transData.diatonicSteps + transData.oct * 7;
  const newDiatonicPitch: number = pitches.indexOf(pnameOld) + diatonicStep * transData.dir;
  const pnameNew: MEIPitchName = pitches[modulo(newDiatonicPitch, 7)];

  const octaveNew = (octaveOld + transData.oct + Math.floor(newDiatonicPitch / 7)) as MEIOctave;
  if (octaveNew > 9) {
    throw new Error('Cannot transpose note to octave higher than 9.');
  }

  const diatonicIntervalClass = ((diatonicStep % 7) + 1) as MEIDiatonicIntervalClassWrapped;
  let accidMod = intervalQualityVerovio[transData.quality];
  /*
      Handle 7th behaving differently with interval quality modifiers.
  */
  const diatonicIntervalClassWrapped = (((diatonicIntervalClass - 1) % 7) + 1) as MEIDiatonicIntervalClassWrapped;
  if (diatonicIntervalClassWrapped === 7) {
    if (transData.quality === 'm' || accidMod >= 0) accidMod++;
  }
  const chromaticInterval = (intervals[diatonicIntervalClassWrapped] + accidMod) * transData.dir;
  const oldNotePC = diatonics[pnameOld] + accidOld;
  const newNoteTransposed = oldNotePC + chromaticInterval;
  const octaveMod = octaveNew - octaveOld;
  const newNoteDiatonicSlot = diatonics[pnameNew] + octaveMod * 12;
  const accidModNew = (newNoteTransposed - newNoteDiatonicSlot) % 12;

  if (Math.abs(accidModNew) > 3) {
    throw Error('Cannot transpose more than 3 accidentals.');
  }
  const accidNew = accidPrimitiveLookup[accidModNew as MEIAccidModAllowed];
  // This is a very basic handling of

  /*
    Return based on input.
  */
  if (note instanceof Element) {
    const noteNew: MEINote = note.cloneNode(true) as Element;
    noteNew.setAttribute('oct', octaveNew.toString());
    noteNew.setAttribute('pname', pnameNew);
    // Ignoring natural for now.
    if (accidNew === 'n') {
      noteNew.removeAttribute('accid');
    } else {
      noteNew.setAttribute('accid', accidNew);
    }
    return note;
  } else if (typeof note === 'object') {
    return {
      oct: octaveNew,
      pname: pnameNew,
      accid: accidNew,
    };
  } else if (typeof note === 'string') {
    const newPitch = (`${octaveNew}${pnameNew}` + (accidNew !== 'n' ? accidNew : '')) as Pitch;
    return newPitch;
  }
  throw new Error(`MEI Note transposition: wrong note type. Cannot transpose note ${note}`);
}

// const note = <note

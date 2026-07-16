/**
 * A Fisher–Yates shuffle algorithm
 * from https://bost.ocks.org/mike/shuffle/
 * @param array
 * @returns shuffled array
 */
export function shuffle<T>(...arrayElems: Array<T>): Array<T> {
  if (arrayElems.length === 1) {
    if (Array.isArray(arrayElems[0])) {
      throw new Error(
        "Your first element provided is an array. Did you mean to spread it? If you want to shuffle in place, use ",
      );
    }
    return arrayElems;
  }
  let m = arrayElems.length;
  let t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arrayElems[m]!;
    arrayElems[m] = arrayElems[i]!;
    arrayElems[i] = t;
  }
  return arrayElems;
}

export function shuffleInPlace<T>(array: Array<T>): Array<T> {
  return shuffle(...array);
}

/**
 * Returns random element from an array
 * @param array
 * @returns
 * @deprecated use element() instead.
 */
export function random(array: Array<any>): any {
  return array[(Math.random() * array.length) | 0];
}

/**
 * Return true or false with given probability.
 * @param probability_of_true (default 0.5)
 * @returns
 */
export function decide(probability_of_true = 0.5): boolean {
  return Math.random() < probability_of_true;
}

/**
 * Return a random positive integer.
 * @param max integer
 * @returns
 */
export function integer(max: number): number {
  return (Math.random() * max) | 0;
}

/**
 * Return a random element of an array.
 * @param array
 * @returns
 */
export function element<T = any>(array: Array<T>): T {
  const index = integer(array.length);
  return array[index]!;
}

/**
 * Return random elements from an array.
 * @param arr
 * @param n
 * @param warn
 * @returns
 */
export function elements<T = any>(
  arr: Array<T>,
  n: number,
  warn: boolean = true,
): Array<T> {
  const domain = shuffle(...arr);
  if (n <= domain.length) {
    return domain.slice(0, n);
  }
  if (warn) {
    console.warn(
      `Not Implemented: too many random elements (${n}) too pick from ${arr.length} elements. In the future version, it should be possible but not yet. Returning ${arr.length} elements.`,
    );
  }
  return domain;
}

/**
 * Return random key of a dictionary.
 * @param dict
 * @returns
 */
export function dictkey(dict: { [k: string]: any }): string {
  const keys: Array<string> = Object.keys(dict);
  return element<string>(keys);
}

/**
 * Return random key and value of a dictionary (as an array).
 * @param dict
 * @returns
 */
export function key_value<T>(dict: { [k: string]: T }): [string, T] {
  const random_key: string = dictkey(dict);
  const val = dict[random_key]!;
  return [random_key, val];
}

// class RandomPitch {

//   constructor(pitches, accidentals) {
//     this.pitches = pitches ?? ["C", "D", "E", "F", "G", "A", "B"]
//     this.accidentals = accidentals ?? ["", "-", "#"]
//   }

//   call()

// }
//

// export function pitchTEST(accidentals): M21PitchName {
//   const p = ["C", "D", "E", "F", "G", "A", "B"];
//   const a = accidentals ?? ["", "-", "#"];
//   const pitch = `${element(p)}${a.length ? element(a) : ""}`;
//   console.log(pitch);
//   return pitch;
// }

// export function pitchWithOctave(
//   octaveOrMin = 4,
//   max?: number,
// ): M21PitchNameWithOctave {
//   if (max && max < octaveOrMin) {
//     throw new Error(
//       `Highest possible octave index should be greater than lowest possible octave index: min ${max} < ${octaveOrMin}`,
//     );
//   }
//   const octave = max ? integer(max - octaveOrMin) + octaveOrMin : octaveOrMin;
//   return `${pitch()}${octave}`;
// }

// export function pitches(n: number, clef?: music21.clef.Clef): PitchName[] {
//   const pitches = new Set();
//   let control = 1000;
//   for (let i = 0; i < control; i++) {
//     pitches.add(pitch());
//     if (pitches.size == n) break;
//   }
//   if (pitches.size !== n) {
//     console.warn("Random pitch set creation overflow.");
//   }
//   return Array.from(pitches) as PitchName[];
// }

// export function duration(
//   dot?: boolean,
//   min?: number,
//   max?: number,
// ): music21.duration.Duration {
//   min ??= 1; // Whole note (0 would be breve).
//   max ??= 64;
//   const quarter_log = 3;
//   const min_log = Math.log2(min); // 0
//   const max_log = Math.log2(max); // 6
//   const neglog = ((Math.random() * max_log) | 0) + min_log;
//   return 2 ** (2 - neglog);
// }

// export function interval(below_octave = true): IntervalName {
//   const intervals = IntervalClass.get_available_interval_names(below_octave);
//   return element(intervals);
// }

// export function intervals(
//   n: number,
//   below_octave = true,
//   //additional_conditions, // not implemented yet but should!
// ): IntervalName[] {
//   const intervals = IntervalClass.get_available_interval_names(below_octave);
//   return elements<IntervalName>(intervals, n);
// }

// // // And it was sooo beautiful!
// // export function interval(): IntervalName {
// //   const is_perfect = decide(0.2857142857);
// //   const category = is_perfect ? ["d", "P", "A"] : ["d", "m", "M", "A"];
// //   const numeric = is_perfect ? [1, 4, 5] : [2, 3, 6, 7];
// //   const signifier = `${random(category)}${random(numeric)}`;
// //   return signifier;
// // }

// // export type ScaleInfo = [ScaleName, ScaleStep[]];
// //
// // export function modal_scale(): ScaleInfo {
// //   const index = (Math.random() * MODAL_SCALES.length) | 0;
// //   const scale_name = MODAL_SCALES[index];
// //   let steps = ["M", "M", "m", "M", "M", "M", "m"];
// //   steps = steps.slice(index, steps.length).concat(steps.slice(0, index));
// //   return [scale_name, steps as ScaleStep[]];
// // }

// // export function tonal_scale(): ScaleInfo {
// //   const scale_name = element<TonalScaleName>(MODAL_SCALES)
// //   let steps = []
// //   const steps = ["M", "M", "m", "M", "M", "M", "m"] as ScaleStep[];
// //   return [scale_name, steps];
// // }

// // export function scales_mixed()
// // BEWARE: 'ionian'/'major' and 'aeolian'/'natural minor' are the same!!!

export function key(furthest_key: number): number {
  const sharps = decide(); // or flats
  const nsig = integer(furthest_key + 1);
  const signature = nsig * (sharps ? 1 : -1);
  return signature;
}

/**
 * Return a segment of a random length of an array.
 * @param array
 * @param allowEmpty allow the returned array to be empty
 * @returns array's segment.
 */
export function segment(array: Array<any>, allowEmpty = false): Array<any> {
  const min = integer(array.length);
  const max = integer(array.length - min) + min + (allowEmpty ? 0 : 1);
  return array.slice(min, max);
}

// export function entityDisplays(n: number): EntityDisplay[] {
//   const displays: EntityDisplay[] = ["score", "label", "audio"];
//   return elements(displays, n);
// }

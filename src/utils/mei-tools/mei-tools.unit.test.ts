import { describe, it, expect } from 'vitest';
import { createNote, transpose } from './mei-tools';
import type { MEIHarmonicInterval, MEIPitchAttributes, Pitch, VerovioTransposition } from './mei-tools';

describe('createNote', () => {
  it('handles different pitch inputs', () => {
    const attrs: MEIPitchAttributes = { oct: 3, pname: 'e', accid: 'ff' };
    const pitch: Pitch = '3eff';
    const noteFromAttrs = createNote(attrs);
    const noteFromPitch = createNote(pitch);
    const noteExpected = document.createElement('note');
    noteExpected.setAttribute('oct', '3');
    noteExpected.setAttribute('pname', 'e');
    noteExpected.setAttribute('accid', 'ff');
    expect(noteFromAttrs).toEqual(noteExpected);
    expect(noteFromPitch).toEqual(noteExpected);
  });
});

describe('transpose', () => {
  it('does basic transposition', () => {
    type PitchTransposedUp = Pitch;
    type PitchtransposedDown = Pitch;
    type Test = [Pitch, MEIHarmonicInterval, PitchTransposedUp, PitchtransposedDown];
    const transpositionsBasic: Test[] = [
      ['3a', 'P1', '3a', '3a'],
      ['3a', 'm2', '3bf', '3gs'],
      ['3a', 'M2', '3b', '3g'],
      ['3a', 'm3', '4c', '3fs'],
      ['3a', 'M3', '4cs', '3f'],
      ['3a', 'P4', '4d', '3e'],
      ['3a', 'A4', '4ds', '3ef'],
      ['3a', 'd5', '4ef', '3ds'],
      ['3a', 'P5', '4e', '3d'],
      ['3a', 'm6', '4f', '3cs'],
      ['3a', 'M6', '4fs', '3c'],
      ['3a', 'd7', '4gf', '2bs'],
      ['3a', 'm7', '4g', '2b'],
      ['3a', 'M7', '4gs', '2bf'],
      ['3a', 'P8', '4a', '2a'],
    ];
    for (let t of transpositionsBasic) {
      const [pitch, interval, pitchExpectedUp, pitchExpectedDown] = t;
      expect(transpose(pitch, interval)).toEqual(pitchExpectedUp);
      expect(transpose(pitch, ('+' + interval) as VerovioTransposition)).toEqual(pitchExpectedUp);
      expect(transpose(pitch, ('-' + interval) as VerovioTransposition)).toEqual(pitchExpectedDown);
    }
  });

  // it('supports multiply diminishes and augmented values', () => {
  //   const aPitch: Pitch = '6fs';
  //   const aExpected: string = '6bsx'; // Pitch yet does not allow for too many flats.
  //   const aInt = 'AAA4';
  //   expect(transpose(aPitch, aInt)).toEqual(aExpected);
  //   const pPitch: Pitch = '6eff';
  //   const pExpected: string = '5bfffff'; // Pitch yet does not allow for too many flats.
  //   const pInt = 'ddd4';
  //   expect(transpose(pPitch, pInt)).toEqual(pExpected);
  // });

  it('is case insensitive for P and A.', () => {
    const aPitch: Pitch = '6fs';
    const aExpected = '6bs';
    const aInt = 'A4';
    expect(transpose(aPitch, aInt)).toEqual(aExpected);
    const pPitch: Pitch = '6eff';
    const pExpected = '6aff';
    const pInt = 'P4';
    expect(transpose(pPitch, pInt)).toEqual(pExpected);
  });
});

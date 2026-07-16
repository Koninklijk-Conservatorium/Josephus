/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */
import type * as verovio from 'verovio';
import type * as Tone from 'tone';
import type { Midi } from '@tonejs/midi';

export type Josephus = {
  verovio: typeof verovio;
  tone: typeof Tone;
  midi: typeof Midi;
  library: Record<string, Library>;
};

declare global {
  interface Window {
    // verovio: { module: VerovioModule; toolkit: typeof VerovioToolkit };
    josephus?: Josephus;
  }
}

// export { format } from './utils/utils';
// export * from './utils/library';

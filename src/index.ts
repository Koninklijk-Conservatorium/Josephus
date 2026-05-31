/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */
import type { VerovioModule, toolkit as VerovioToolkit } from 'verovio';
import type * as Tone from 'tone';
import type { Midi } from '@tonejs/midi';

export interface Josephus {
  verovio: VerovioToolkit;
  tone: typeof Tone;
}

declare global {
  interface Window {
    verovio: { module: VerovioModule; toolkit: typeof VerovioToolkit };
    josephus?: {
      verovio?: VerovioToolkit;
      tone?: typeof Tone;
      midi: typeof Midi;
    };
  }
}

export { format } from './utils/utils';

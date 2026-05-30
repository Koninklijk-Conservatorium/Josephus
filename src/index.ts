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

declare global {
  interface Window {
    verovio: { module: VerovioModule; toolkit: typeof VerovioToolkit };
    josephus?: {
      verovio?: VerovioToolkit;
    };
  }
}

export { format } from './utils/utils';
export { VerovioComponent } from './utils/classes';
export type * from './components.d.ts';

import { Component, Listen, State } from '@stencil/core';
import type { toolkit as VerovioToolkit } from 'verovio';
import type * as Tone from 'tone';
import type { Josephus } from '../index.ts';
import type { Midi } from '@tonejs/midi';

@Component({
  tag: 'josephus-base-component',
  shadow: true,
})
export abstract class JosephusComponent implements Josephus {
  @State() verovio: VerovioToolkit | undefined = window.josephus.verovio;
  @State() tone: typeof Tone | undefined = window.josephus.tone;
  @State() midi: typeof Midi | undefined = window.josephus.midi;

  @Listen('josephus-verovio-initialized', { target: 'document' })
  verovioInitHandler(_event) {
    this.verovio = window.josephus.verovio;
  }

  @Listen('josephus-tonejs-initialized', { target: 'document' })
  toneInitHandler(_event) {
    this.tone = window.josephus.tone;
  }

  @Listen('josephus-tonemidi-initialized', { target: 'document' })
  midiInitHandler(_event) {
    this.midi = window.josephus.midi;
  }

  componentDidLoad() {}
}

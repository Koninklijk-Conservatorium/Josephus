import { Component, h, Prop } from '@stencil/core';
import type { VerovioOptions } from 'verovio';
import { JosephusComponent } from '../../utils/JosephusComponent';

import type { ScoreRepr } from '../josephus-task/josephus-task';

type ScoreSVG = string;

@Component({
  tag: 'josephus-snippet',
  styleUrl: 'josephus-snippet.css',
  shadow: true,
})
export class JosephusSnippet extends JosephusComponent {
  private layout: VerovioOptions = {
    adjustPageHeight: true,
    adjustPageWidth: true,
    scale: 30,
    scaleToPageSize: false,
    footer: 'none',
    header: 'none',
  };

  @Prop() href: string | null;
  @Prop() data: string | null;
  @Prop() repr: ScoreRepr[] = ['label', 'audio', 'score'];

  private renderScore(): ScoreSVG | undefined {
    // if (!this.verovio) return;
    // if (!this.data) return;
    const v = this.verovio;
    v.loadData(this.data);
    v.resetOptions();
    v.setOptions(this.layout);
    return v.renderToSVG();
  }

  private play(midi) {
    // TO DO: refactor.
    const synth = new this.tone.PolySynth(this.tone.FMSynth).toDestination();
    // const piano = new Piano().toDestination();
    if (!midi) return;
    const transport = this.tone.getTransport();
    this.tone.start();
    transport.stop();
    transport.position = 0;
    transport.cancel();
    // transport.clear();
    for (let track of midi.tracks) {
      const part = new this.tone.Part((time, note) => {
        synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }, track.notes);
      part.start();
    }
    transport.bpm.value *= 0.75; // Primitive way of slowing.
    transport.start();
  }

  private displayScore($div: HTMLDivElement) {
    // SVG needs to be attached directly to innerHTML.
    if (this.repr.indexOf('score') === -1) return;
    const score: ScoreSVG | undefined = this.renderScore();
    if (score) $div.innerHTML = score;
    else $div.innerText = 'josephus-snippet: No score provided.';
  }

  private displayLabel() {
    if (this.repr.indexOf('label') === -1) return;
    return <div>Dummy label.</div>;
  }

  private displayPlaybackCtrl() {
    if (this.repr.indexOf('audio') === -1) return;
    const midiTxt = this.verovio.renderToMIDI();
    if (!midiTxt) return;
    const bytes = atob(midiTxt);
    const array = new Uint8Array(bytes.length); // change it to Uint8Array.from() when becomes available to all the browsers.
    for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
    const midi = new this.midi(array);
    const play = () => this.play(midi.toJSON());
    return <button onClick={play}>PLAY AUDIO</button>;
  }

  async componentWillRender() {
    if (this.repr.indexOf('label') === -1) return;
    if (!this.href) return;
    this.data ??= await fetch(this.href)
      .then(resp => resp.text())
      .then(scoreTXT => scoreTXT);
    this.verovio.loadData(this.data);
  }

  render() {
    return this.repr.map(repr => (
      <div
        ref={$div => {
          if (repr === 'score') this.displayScore($div);
          // this[`$${repr}`] = $div;
        }}
      >
        {(() => {
          switch (repr) {
            case 'score':
              return; // Handled above because SVG must be loaded directly to innerHTML.
            case 'audio':
              return this.displayPlaybackCtrl?.();
            case 'label':
              return this.displayLabel();
            default:
              repr satisfies never;
          }
        })()}
      </div>
    ));
  }
}

import { Component, h, Prop } from '@stencil/core';
import type { VerovioOptions } from 'verovio';
import { VerovioComponent } from '../../utils/VerovioComponent';

import type { ScoreRepr } from '../josephus-task/josephus-task';

type ScoreSVG = string;

@Component({
  tag: 'josephus-snippet',
  styleUrl: 'josephus-snippet.css',
  shadow: true,
})
export class JosephusSnippet extends VerovioComponent {
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

  get score() {
    // SVG needs to be attached directly to innerHTML.
    const score: ScoreSVG | undefined = this.verovio.renderToSVG();
    if (!score) return <div>josephus-snippet: No score provided.</div>;
    return <div innerHTML={this.verovio.renderToSVG()}></div>;
  }

  get label() {
    return <div>Dummy label.</div>;
  }

  get audio() {
    const midiTxt = this.verovio.renderToMIDI();
    return <josephus-audio midi={midiTxt}></josephus-audio>;
  }

  async componentWillRender() {
    this.data ??= await fetch(this.href)
      .then(resp => resp.text())
      .then(scoreTXT => scoreTXT);
    this.loadData(this.data, this.layout);
  }

  render() {
    // return this.repr.map(repr => <div ref={$div => (this[`$${repr}`] = $div)}></div>);
    return this.repr.map(repr => {
      switch (repr) {
        case 'score':
          return this.score;
        case 'audio':
          return this.audio;
        case 'label':
          return this.label;
      }
    });
  }
}

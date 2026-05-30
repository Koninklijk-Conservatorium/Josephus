import { Component, h, Prop, State } from '@stencil/core';
import type { toolkit as VerovioToolkit, VerovioOptions } from 'verovio';
import { VerovioComponent } from '../../utils/classes';
import type { ScoreRepr } from '../josephus-task/josephus-task';

type ScoreSVG = string;

@Component({
  tag: 'josephus-snippet',
  styleUrl: 'josephus-snippet.css',
  shadow: true,
})
export class JosephusSnippet extends VerovioComponent {
  private $label!: HTMLDivElement;
  private $audio!: HTMLDivElement;
  private $score!: HTMLDivElement;

  private layout: VerovioOptions = {
    adjustPageHeight: true,
    adjustPageWidth: true,
    scale: 30,
    scaleToPageSize: false,
    footer: 'none',
    header: 'none',
  };

  @State() verovio: VerovioToolkit | undefined = window.josephus?.verovio;
  @Prop() href: string | null;
  @Prop() data: string | null;
  @Prop() repr: ScoreRepr[] = ['label', 'audio', 'score'];

  private renderScore(): ScoreSVG | undefined {
    if (!(this.verovio || this.data)) return;
    const v = this.verovio;
    v.loadData(this.data);
    v.resetOptions();
    v.setOptions(this.layout);
    return v.renderToSVG();
  }

  private displayScore($div: HTMLDivElement) {
    // SVG needs to be attached directly to innerHTML.
    const score: ScoreSVG | undefined = this.renderScore();
    if (score) $div.innerHTML = score;
    else $div.innerText = 'josephus-snippet: No score provided.';
  }

  private displayLabel() {
    return <div>Dummy label.</div>;
  }

  private displayPlaybackCtrl() {
    return <button>PLAY AUDIO</button>;
  }

  async componentWillRender() {
    if (!this.href) return;
    this.data ??= await fetch(this.href)
      .then(resp => resp.text())
      .then(scoreTXT => scoreTXT);
  }

  render() {
    return this.repr.map(repr => (
      <div
        ref={$div => {
          if (repr === 'score') this.displayScore($div);
          this[`$${repr}`] = $div;
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

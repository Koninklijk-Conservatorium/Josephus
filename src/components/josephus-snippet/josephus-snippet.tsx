import { Component, h, Prop, type JSX } from '@stencil/core';
import type { VerovioOptions } from 'verovio';
import { VerovioComponent } from '../../utils/VerovioComponent';



type ScoreSVG = string;

@Component({
  tag: 'josephus-snippet',
  styleUrl: 'josephus-snippet.css',
  shadow: true,
})
export class JosephusSnippet extends VerovioComponent {

  @Prop() href: string | null = null;
  @Prop({ mutable: true }) data: string | null = null;
  @Prop() repr: ScoreRepr[] = ['label', 'audio', 'score'];
  @Prop() select: SelectionMEI = { measureRange: { measureRange: 'start-end' } };
  @Prop() scoreOptions: VerovioOptions = {
    adjustPageHeight: true,
    adjustPageWidth: true,
    scale: 30,
    scaleToPageSize: false,
    footer: 'none',
    header: 'none',
    breaks: "none"
  };

  get score() {
    if (!this.verovio) return this.warnVerovioNotLoaded(<div>Verovio not loaded.</div>)
    const score: ScoreSVG | undefined = this.verovio.renderToSVG();
    if (!score) return <div>josephus-snippet: No score provided.</div>;
    /*
      The only way to make it work is to
      attach the SVG directly to innerHTML.
    */
    return <div innerHTML={this.verovio.renderToSVG()}></div>;
  }

  get label(): JSX.Element {
    return <div>Dummy label.</div>;
  }

  get audio(): JSX.Element {
    if (!this.verovio) return this.warnVerovioNotLoaded(<div>Verovio not loaded.</div>)
    const midiTxt = this.verovio.renderToMIDI();
    return <josephus-audio midi={midiTxt}></josephus-audio>;
  }

  async componentWillRender(): Promise<void> {
    if (!this.verovio) return this.warnVerovioNotLoaded(undefined)
    if (!(this.data || this.href)) return
    this.data ??= await fetch(this.href!)
      .then(resp => resp.text())
      .then(scoreTXT => scoreTXT);
    if (!this.data) {
      return console.warn('Cannot load data for snippet: ', this.data)
    }
    // TO DO: not supporting eventRange yet.
    console.log(this.select.measureRange)
    this.verovio.select(this.select.measureRange)
    this.loadData(this.data, this.scoreOptions);
  }

  render() {
    return this.repr.map(repr => {
      switch (repr) {
        case 'score':
          return this.score;
        case 'audio':
          return this.audio;
        case 'label':
          return this.label;
        default:
          repr satisfies never
      }
    });
  }
}

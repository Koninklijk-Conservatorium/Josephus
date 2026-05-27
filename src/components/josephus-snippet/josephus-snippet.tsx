import { Component, h, Method, Prop, State, Watch, Listen } from '@stencil/core';
import type { toolkit as VerovioToolkit, VerovioOptions } from 'verovio';
import { VerovioComponent } from '../../utils/classes';

@Component({
  tag: 'josephus-snippet',
  styleUrl: 'josephus-snippet.css',
  shadow: true,
})
export class JosephusSnippet extends VerovioComponent {
  private $score!: HTMLDivElement;
  private layout: VerovioOptions = {
    adjustPageHeight: true,
    adjustPageWidth: true,
    scale: 30,
    scaleToPageSize: false,
    footer: 'none',
    header: 'none',
  };

  @State() verovio: VerovioToolkit;

  @Prop() href: string;

  @Watch('href')
  @Watch('verovio')
  renderScore() {
    if (!(this.href || this.verovio || this.$score)) return;
    fetch(this.href)
      .then(resp => resp.text())
      .then(scoreText => {
        this.$score.innerHTML = this.verovio.renderData(scoreText, this.layout);
      });
  }

  render() {
    return <div ref={d => (this.$score = d as HTMLDivElement)}></div>;
  }
}

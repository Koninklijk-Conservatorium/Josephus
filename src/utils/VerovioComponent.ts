import { Component, Listen, State } from '@stencil/core';
import type { toolkit as VerovioToolkit, VerovioOptions } from 'verovio';

@Component({
  tag: 'josephus-base-component',
  shadow: true,
})
export abstract class VerovioComponent {
  @State() verovio: VerovioToolkit | undefined = window.josephus.verovio;

  @Listen('josephus-verovio-initialized', { target: 'document' })
  verovioInitHandler(_event) {
    this.verovio = window.josephus.verovio;
  }

  loadData(data: string, options: VerovioOptions = {}) {
    this.verovio.resetOptions();
    this.verovio.setOptions(options);
    this.verovio.loadData(data);
  }

  getMEI() {
    return this.verovio.getMEI();
  }

  componentDidLoad() {}
}

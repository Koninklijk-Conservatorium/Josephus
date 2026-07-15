import { Component, Listen, State } from '@stencil/core';
import type { toolkit as VerovioToolkit, VerovioOptions } from 'verovio';

@Component({
  tag: 'josephus-base-component',
  shadow: true,
})
export abstract class VerovioComponent {
  @State() verovio: VerovioToolkit | undefined = this.createVerovio()

  @Listen('josephus-verovio-initialized', { target: 'document' })
  verovioInitHandler(_event: Event) {
    this.verovio = this.createVerovio()
  }

  private createVerovio(): VerovioToolkit | undefined {
    return window.josephus ? new window.josephus.verovio.toolkit() : undefined
  }

  protected warnVerovioNotLoaded<T extends any>(dummy:T): T {
    console.warn('Verovio not loaded.')
    return dummy
  }

  loadData(data: string, options: VerovioOptions = {}): void {
    if (!this.verovio) return this.warnVerovioNotLoaded(undefined)
    this.verovio.resetOptions();
    this.verovio.setOptions(options);
    this.verovio.loadData(data);
  }

  getMEI(): string {
    if (!this.verovio) return this.warnVerovioNotLoaded('')
    return this.verovio.getMEI();
  }

  componentDidLoad() {}
}

import { Component, Listen } from '@stencil/core';
import type { toolkit as VerovioToolkit } from 'verovio';

@Component({
  tag: 'josephus-verovio-component',
  shadow: true,
})
export abstract class VerovioComponent {
  abstract verovio: VerovioToolkit | undefined;

  @Listen('josephus-verovio-initialized', { target: 'document' })
  verovioInitHandler(_event) {
    this.verovio = window.josephus.verovio;
  }
}

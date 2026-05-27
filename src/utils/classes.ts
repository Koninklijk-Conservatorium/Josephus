import { Component, h, State, Listen } from '@stencil/core';
import type { toolkit as VerovioToolkit } from 'verovio';

export abstract class VerovioComponent {
  @State() abstract verovio: VerovioToolkit;

  @Listen('josephus-verovio-initialized', { target: 'document' })
  verovioInitHandler(event) {
    this.verovio = window.josephus.verovio;
  }
}

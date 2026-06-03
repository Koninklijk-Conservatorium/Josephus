import { Component, h, Prop, Listen, State, Watch } from '@stencil/core';
import type * as Tone from 'tone';
import type { Midi } from '@tonejs/midi';

@Component({
  tag: 'josephus-audio',
  styleUrl: 'josephus-audio.css',
  shadow: true,
})
export class JosephusAudio {
  @State() tone: typeof Tone | undefined = window.josephus.tone;
  @State() ToneMidi: typeof Midi | undefined = window.josephus.midi;

  @Listen('josephus-tonejs-initialized', { target: 'document' })
  toneInitHandler(_event) {
    this.tone = window.josephus.tone;
  }

  @Listen('josephus-tonemidi-initialized', { target: 'document' })
  midiInitHandler(_event) {
    this.ToneMidi = window.josephus.midi;
  }

  @Prop() midi: string; // In Verovio's txt format.

  private parts: Tone.Part[];

  @Watch('midi', { immediate: true })
  loadParts() {
    if (!this.midi) {
      console.warn('josephus-audio: no midi to play.');
      return;
    }
    const bytes = atob(this.midi);
    const array = new Uint8Array(bytes.length); // change it to Uint8Array.from() when becomes available to all the browsers.
    for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
    const midi = new this.ToneMidi(array).toJSON();
    // TO DO: refactor, expand.
    this.tone.start();
    const synth = new this.tone.PolySynth(this.tone.FMSynth).toDestination();
    this.parts = midi.tracks.map(track => new this.tone.Part((time, note) => synth.triggerAttackRelease(note.name, note.duration, time, note.velocity), track.notes));
  }

  play() {
    // const piano = new Piano().toDestination();
    const transport = this.tone.getTransport();
    transport.stop();
    transport.cancel();
    transport.position = 0;
    this.parts.forEach(part => part.start());
    // transport.bpm.value *= 0.75; // Primitive way of slowing.
    transport.start();
  }

  componentWillRender() {
    this.loadParts();
  }

  render() {
    return <button onClick={() => this.play()}>PLAY AUDIO</button>;
  }
}

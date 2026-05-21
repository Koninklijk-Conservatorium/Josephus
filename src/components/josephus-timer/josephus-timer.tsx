import { Component, AttachInternals, Prop, State, h, Event, EventEmitter } from '@stencil/core';

type Seconds = number;
type JosephusTimerState = 'warmup' | 'danger' | 'overrun';
type JosephusTimerProgress = 'started' | 'paused' | 'resumed' | 'stopped' | 'finished';
type States<T extends string> = { [K in T]: boolean };

// Typescript doesn't see a correct definition of this, so I shadow it.
interface CustomStateSet extends Set<string> {}

@Component({
  tag: 'josephus-timer',
  styleUrl: 'josephus-timer.css',
  shadow: true,
})
export class JosephusTimer {
  @AttachInternals({
    states: {
      warmup: false,
      danger: false,
      overrun: false,
    } satisfies States<JosephusTimerState>,
  })
  internals: ElementInternals;

  private _state: JosephusTimerState | null = null;
  private _timer: ReturnType<typeof window.setInterval> | number | null;
  private _paused: boolean = false;

  @State() time: Seconds;

  @Event({ eventName: 'josephus-timer-state-changed' })
  timerStateChanged: EventEmitter<{ state: JosephusTimerState | null }>;

  private changeState(stateNew: JosephusTimerState = null) {
    if (this._state === stateNew) return;
    const states: CustomStateSet = this.internals.states as unknown as CustomStateSet; // Workaround for typescript old definition.
    states.clear ? states.clear() : (() => states.forEach(state => states.delete(state)))!; // CustomStateSet.clear() not be implemented everywhere.
    this._state = stateNew;
    if (stateNew) states.add(stateNew);
    this.timerStateChanged.emit({ state: this._state });
  }

  @Event({ eventName: 'josephus-timer-progress' })
  timerProgress: EventEmitter<{ progress: JosephusTimerProgress }>;

  private progress(progress: JosephusTimerProgress) {
    this.timerProgress.emit({ progress: progress });
  }

  @Prop() debug: boolean = true;
  @Prop() secs: number = this.debug ? 10 : 60;
  @Prop() warmup: number = this.debug ? 3 : 0;
  @Prop() danger: number = this.debug ? 5 : 0;
  @Prop() overrun: number = this.debug ? 2 : 0;
  @Prop() overrunText: string = "Time's up!";

  @Prop()
  get state(): JosephusTimerState | null {
    return this._state;
  }
  @Prop()
  get started(): boolean {
    return !!this._timer;
  }
  @Prop()
  get paused(): boolean {
    return this._paused;
  }
  @Prop()
  get runs(): boolean {
    return this.started && !this.paused;
  }

  stop() {
    this.changeState();
    window.clearInterval(this._timer);
    this.progress('stopped');
  }

  pause() {
    this._paused = true;
    this.stop();
    this.progress('paused');
  }

  start() {
    const update = () => {
      if (this.time > this.secs) {
        this.changeState('warmup');
      } else if (this.time > this.danger) {
        this.changeState();
      } else if (this.time > 0) {
        this.changeState('danger');
      } else if (this.overrun && this.time >= 1 - this.overrun) {
        this.changeState('overrun');
      } else {
        this.stop();
        this.finish();
      }
    };
    const tick = () => {
      this.time -= 1;
      update();
    };

    if (!this._paused) {
      this.stop();
      this.time = this.warmup + this.secs;
      this.progress('started');
      update();
    } else {
      this.progress('resumed');
    }
    this._timer = window.setInterval(tick, 1000);
  }

  finish() {
    this.progress('finished');
  }

  formatClockDisplay(seconds: Seconds): string {
    const minutes = (seconds / 60) >> 0;
    const secondsLeft = seconds % 60;
    return `${minutes} : ${secondsLeft < 10 ? 0 : ''}${secondsLeft}`;
  }

  connectedCallback() {
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  render() {
    const time = Math.max(0, this.time);
    const timeFormatted = time > 0 ? this.formatClockDisplay(time) : this.overrunText;
    return <div>{timeFormatted}</div>;
  }
}

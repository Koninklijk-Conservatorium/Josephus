import { Component, h, Method, State, type JSX } from '@stencil/core';
import type { JosephusTaskLoadingState } from '../josephus-task/josephus-task';

type ChallengeState = 'preparation' | 'started' | 'finished';

@Component({
  tag: 'josephus-challenge',
  styleUrl: 'josephus-challenge.css',
  shadow: true,
})
export class JosephusChallenge {
  private $timer: any;
  private $task: any; // HTMLJosephusTaskElement;

  private nextTask() {
    const spec = this.spec.tasks[0]; // Dummy implementation.
    this.$task.load(spec);
  }

  private handleTimer(timerProgressEvent: CustomEvent) {
    if (!(timerProgressEvent.detail.progress === 'finished')) return;
    this.state = 'finished';
  }

  private handleTaskLoading(taskLoading: CustomEvent) {
    const state: JosephusTaskLoadingState = taskLoading.detail.state;
    switch (state) {
      case 'loading':
        this.$timer.pause();
        break;
      case 'loaded':
        this.$timer.start();
        break;
      default:
        state satisfies never;
    }
  }

  @State() state: ChallengeState = 'preparation';
  @State() spec: ChallengeSpec;
  @Method() load(spec: ChallengeSpec) {
    this.spec = spec;
  }

  private preparationScreen() {
    const start = () => (this.state = 'started');
    return (
      <>
        <div>Preparation.</div>
        <button onClick={start}>Start challenge.</button>
      </>
    );
  }

  private startedScreen() {
    const next = async () => this.nextTask();
    const finish = () => (this.state = 'finished');
    return (
      <>
        <josephus-timer ref={$ => (this.$timer = $)} onJosephus-timer-progress={e => this.handleTimer(e)} />
        <josephus-task ref={$ => (this.$task = $)} onJosephus-task-loading={e => this.handleTaskLoading(e)} />
        <button onClick={next}>Next task.</button>
        <button onClick={finish}>Finish challenge.</button>
      </>
    );
  }

  private finishedScreen() {
    const restart = () => (this.state = 'started');
    return (
      <>
        <div>Challenge has finished.</div>
        <div>Your score: 0</div>
        <button onClick={restart}>Retry.</button>
      </>
    );
  }

  private renderScreen() {
    const screens = {
      preparation: () => this.preparationScreen(),
      started: () => this.startedScreen(),
      finished: () => this.finishedScreen(),
    } satisfies Record<ChallengeState, () => JSX.Element>;
    return screens[this.state]();
  }

  componentDidRender() {
    if (!this.$task) return;
    this.nextTask();
  }

  render() {
    return <>{this.renderScreen()}</>;
  }
}

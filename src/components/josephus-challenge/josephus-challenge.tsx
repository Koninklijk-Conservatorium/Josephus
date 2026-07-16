import { Component, h, Prop, State, type JSX } from '@stencil/core';
import type { JosephusTaskLoadingState } from '../josephus-task/josephus-task';

type ChallengeState = 'preparation' | 'started' | 'finished';

@Component({
  tag: 'josephus-challenge',
  styleUrl: 'josephus-challenge.css',
  shadow: true,
})
export class JosephusChallenge {
  private $timer: any;

  private nextTask() {
    this.taskCounter += 1;
    this.taskCurrent = this.spec!.tasks[0] // dummy for now.
  }

  private start() {
    this.state = 'started'
    this.nextTask()
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
  @State() taskCounter: number = 0;
  @State() taskCurrent: TaskSpec | undefined;

  @Prop() spec: ChallengeSpec | undefined // TO DO: make it have a dummy initializer.

  private preparationScreen() {
    return (
      <>
        <div>Preparation.</div>
        <button onClick={() => this.start()}>Start challenge</button>
      </>
    );
  }

  private startedScreen() {
    return (
      <>
        <josephus-timer secs={240} ref={$ => (this.$timer = $)} onJosephus-timer-progress={e => this.handleTimer(e)} />
        <josephus-task spec={this.taskCurrent} count={this.taskCounter} onJosephus-task-loading={e => this.handleTaskLoading(e)} />
        <button onClick={() => this.nextTask()}>Next task</button>
        <button onClick={() => this.state = 'finished'}>Finish challenge</button>
      </>
    );
  }

  private finishedScreen() {
    const restart = () => (this.state = 'started');
    return (
      <>
        <div>Challenge has finished.</div>
        <div>Your score: 0</div>
        <button onClick={restart}>Retry</button>
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

  render() {
    return <>{this.renderScreen()}</>;
  }
}

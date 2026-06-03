import { Component, h, Listen, Method, State, type JSX } from '@stencil/core';

type ChallengeState = 'preparation' | 'started' | 'finished';

@Component({
  tag: 'josephus-challenge',
  styleUrl: 'josephus-challenge.css',
  shadow: true,
})
export class JosephusChallenge {
  private $timer: any;
  private $task: any; // HTMLJosephusTaskElement;

  private handleTimer(event: CustomEvent) {
    if (!(event.detail.progress === 'finished')) return;
    this.state = 'finished';
  }

  @State() state: ChallengeState = 'preparation';
  @State() spec: ChallengeSpec;
  @Method() load(spec: ChallengeSpec) {
    this.spec = spec;
  }

  preparationScreen() {
    const start = () => (this.state = 'started');
    return (
      <>
        <div>Preparation.</div>
        <button onClick={start}>Start challenge.</button>
      </>
    );
  }

  startedScreen() {
    const next = async () => {
      const spec = this.spec.tasks[0]; // Dummy implementation.
      await this.$task.load(spec);
    };
    return (
      <>
        <josephus-timer ref={$ => (this.$timer = $)} onJosephus-timer-progress={e => this.handleTimer(e)} />
        <josephus-task ref={$ => (this.$task = $)} />
        <button onClick={next}>Next task.</button>
      </>
    );
  }

  finishedScreen() {
    const restart = () => (this.state = 'started');
    return (
      <>
        <div>Challenge has finished.</div>
        <div>Your score: 0</div>
        <button onClick={restart}>Retry.</button>
      </>
    );
  }

  renderScreen() {
    const screens = {
      preparation: () => this.preparationScreen(),
      started: () => this.startedScreen(),
      finished: () => this.finishedScreen(),
    } satisfies Record<ChallengeState, () => JSX.Element>;
    return screens[this.state]();
  }

  render() {
    const finish = () => (this.state = 'finished');
    return (
      <>
        {this.renderScreen()}
        <button onClick={finish}>Finish challenge.</button>
      </>
    );
  }
}

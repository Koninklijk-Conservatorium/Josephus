import { Component, h, Method, State } from '@stencil/core';
// import type { JosephusTask } from '../josephus-task/josephus-task';

@Component({
  tag: 'josephus-challenge',
  styleUrl: 'josephus-challenge.css',
  shadow: true,
})
export class JosephusChallenge {
  private $task!: any; //HTMLJosephusTaskElement;
  private async next() {
    const spec = this.spec.tasks[0]; // Dummy implementation.
    await this.$task.load(spec);
  }
  @State() spec: ChallengeSpec;
  @Method() load(spec: ChallengeSpec) {
    this.spec = spec;
  }
  render() {
    const next = async () => await this.next();
    return (
      <>
        <josephus-task ref={$ => (this.$task = $)} />
        <button onClick={next}>Next task.</button>
      </>
    );
  }
}

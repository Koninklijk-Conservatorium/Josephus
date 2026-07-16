import { Component, Host, h, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 'josephus-exam',
  styleUrl: 'josephus-exam.css',
  shadow: true,
})
export class JosephusExam {
  @Prop() href?: string;
  @State() spec?: ExamSpec;
  @State() challenge: number | undefined = undefined;

  @Method()
  async reset() {
    this.challenge = undefined
    this.spec = undefined
  }

  private examScreen() {
    return <Host>
      {this.spec!.challenges.map((_, i) => (
        <button onClick={() => this.challenge = i}>Challenge {i + 1}</button>
      ))}
    </Host>
  }

  private challengeScreen() {
    return (
      <Host>
        <josephus-challenge
          spec={this.spec!.challenges[this.challenge!]}
        />
        <button onClick={() => this.challenge = undefined}>Back to exam.</button>
      </Host>
    );
  }

  async componentWillRender() {
    if (!(this.spec || this.href)) return
    this.spec ??= await fetch(this.href!).then(r => r.json());
  }

  render() {
    return this.spec ? this.challenge === undefined ? this.examScreen() : this.challengeScreen() : <div>Josephus Exam not provided.</div>;
  }
}

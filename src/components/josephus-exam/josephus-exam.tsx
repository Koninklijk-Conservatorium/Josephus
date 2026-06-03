import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'josephus-exam',
  styleUrl: 'josephus-exam.css',
  shadow: true,
})
export class JosephusExam {
  private $challenge: any | undefined;
  @Prop() href: string;
  @State() spec: ExamSpec;
  @State() challenge: number | undefined = undefined;

  startChallenge(i: number) {
    this.challenge = i;
    // Component loads in challengeScreen().
    // Challenge spec loads in componentDidLoad().
  }

  endChallenge() {
    this.challenge = undefined;
    this.$challenge = undefined;
  }

  examScreen() {
    this.$challenge;
    return this.spec.challenges.map((_, i) => <button onClick={() => this.startChallenge(i)}>Challenge {i + 1}</button>);
  }

  challengeScreen() {
    return (
      <>
        <josephus-challenge ref={$ => (this.$challenge = $)}></josephus-challenge>
        <button onClick={() => this.endChallenge()}>Back to exam.</button>
      </>
    );
  }

  async componentWillRender() {
    this.spec = await fetch(this.href).then(r => r.json());
  }

  componentDidRender() {
    if (this.$challenge) {
      const spec: ChallengeSpec = this.spec.challenges[this.challenge];
      this.$challenge?.load(spec);
    }
  }

  render() {
    return this.challenge === undefined ? this.examScreen() : this.challengeScreen();
  }
}

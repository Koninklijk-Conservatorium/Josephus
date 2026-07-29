import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'josephus-exam',
  styleUrl: 'josephus-exam.css',
  shadow: true,
})
export class JosephusExam {
  @Prop() href?: string;
  @Prop() spec?: ExamSpec;
  @State() challenge: number | undefined = undefined;

  private examScreen() {

    /*
      Group challenges by categories.
    */

    type Categories = Record<ChallengeCategoryRef | "_unspecified", ChallengeSpec[]>

    const categories: Categories = { _unspecified: [] };
    this.spec!.challenges.forEach((challenge) => {
      const category = challenge.category ?? "_unspecified";
      (categories[category] ??= []).push(challenge);
    })

    return <div part="category-list">
      {
        Object.entries(categories).map(entry => {
          const name = entry[0].split('/').at(-1) as ChallengeCategoryRef // TO DO: this JSONPointer is resolved manually. Make it automatic.
          const challenges = entry[1]
          const category = this.spec?.categories[name]
          console.log(category)
          return (
            <div part="category">
              <div part="category-description" class={name}>
                <h3 part="category-title">{category?.label ?? ""}</h3>
                <div part="category-instruction">{category?.instruction ?? ""}</div>
              </div>
              <div part="challenge-list">
                {challenges.map((challenge, i) => (
                  <button part="challenge-button" onClick={() => this.challenge = this.spec?.challenges.indexOf(challenge)}>
                    <div part="challenge-button-description">
                      <div part="challenge-button-title">Challenge {i + 1}</div>
                      <div part="challenge-button-score">0 (0%) &gt;</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })
      }
    </div>
  }

  private challengeScreen() {
    return (
      <div part="challenge">
        <josephus-challenge
          spec={this.spec!.challenges[this.challenge!]}
        />
        <button onClick={() => this.challenge = undefined}>Back to exam.</button>
      </div>
    );
  }

  async componentWillRender() {
    if (!(this.spec || this.href)) return
    this.spec ??= await fetch(this.href!).then(r => r.json());
  }

  render() {
    if (!this.spec) return <div>Josephus Exam not provided.</div>;
    return (<div part="exam">
      <h1 part="title">{this.spec.title}</h1>
      <h2 part="instruction">{this.spec.instruction}</h2>
      {
        this.challenge === undefined
        ? this.examScreen()
          : this.challengeScreen()
      }
    </div>)
  }
}

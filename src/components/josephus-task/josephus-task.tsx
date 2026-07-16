import { Component, h, State, Event, EventEmitter, Prop, Host } from '@stencil/core';
import { VerovioComponent } from '../../utils/VerovioComponent';
import { Score } from '../../utils/Score';

export type JosephusTaskLoadingState = 'loading' | 'loaded';


@Component({
  tag: 'josephus-task',
  styleUrl: 'josephus-task.css',
  shadow: true,
})
export class JosephusTask extends VerovioComponent {
  @Prop() count: number = 0;
  @Prop() spec: TaskSpec | undefined;

  @State() scores: ScoreData[] = [];

  @Event({ eventName: 'josephus-task-loading' })
  taskLoading: EventEmitter<{ state: JosephusTaskLoadingState }>;

  async componentWillRender() {
    if (!(this.verovio && this.spec)) return;
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, mei templates etc).
    this.scores = []
    for await (let scoreSpec of this.spec.scores) {
      // if (scoreSpec.source === '') {
      //   const doc = new MEIDocument.fromTemplate(scoreSpec);
      //   scores.push(doc);
      //   continue;
      // }
      const mei = await new Score(scoreSpec).retrieve()
      /* Convert to MEI. */
      /* TO DO: only when file format is not .verovio.mei. */
      this.loadData(mei)
      const meiVerovio = this.getMEI() as StringMEI
      const score: ScoreData = {
        mei: meiVerovio,
        spec: scoreSpec,
        segments: [{ measureRange: { measureRange: 'start-end' } }]
      }
      this.scores.push(score)
    }
  }

  componentDidLoad() {
    super.componentDidLoad();
  }

  render() {
    if (!this.spec) return <div>JosephusTask: No spec provided.</div>;
    return <Host>
      {this.spec.fields.map(spec => (
        <josephus-field spec={spec} scores={spec.scoreRefs.map(i => ({...this.scores[i]}))} />
      ))}
    </Host>
  }
}

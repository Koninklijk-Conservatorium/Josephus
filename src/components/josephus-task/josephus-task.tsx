import { Component, h, State, Event, EventEmitter, Prop } from '@stencil/core';
import { VerovioComponent } from '../../utils/VerovioComponent';
import { Score } from '../../utils/Score';
import { MEIDocument } from '../../utils/mei';

export type JosephusTaskLoadingState = 'loading' | 'loaded';

@Component({
  tag: 'josephus-task',
  styleUrl: 'josephus-task.css',
  shadow: true,
})
export class JosephusTask extends VerovioComponent {
  @Prop() count: number = 0;
  @Prop() spec: TaskSpec | undefined;
  @State() scores: MEIDocument[];

  private DO_NOT_RENDER = false;

  @Event({ eventName: 'josephus-task-loading' })
  taskLoading: EventEmitter<{ state: JosephusTaskLoadingState }>;

  async componentWillRender() {
    if (!(this.verovio && this.spec)) return;
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, music21j etc).
    const scores: MEIDocument[] = [];
    for await (let scoreSpec of this.spec.scores) {
      // if (scoreSpec.source === '') {
      //   const doc = new MEIDocument.fromTemplate(scoreSpec);
      //   scores.push(doc);
      //   continue;
      // }
      const source = new Score(scoreSpec);
      const score: string = await source.retrieve();
      /* Convert to MEI. */
      this.loadData(score);
      const mei: string = this.getMEI();
      /* Load doc. */
      const doc = MEIDocument.parse(mei);
      scores.push(doc);
    }
    this.scores = scores;
  }

  componentDidLoad() {
    super.componentDidLoad();
  }

  renderDisplay(field: FieldSpec, scores: string[]) {
    return scores.map(score => <josephus-snippet data={score} repr={field.repr}></josephus-snippet>);
  }

  renderQuiz(field: FieldSpec, scores: string[]) {
    return Array.from({ length: field.items }, (_, i) => i).map(i => this.renderQuizField(i, field, scores));
  }

  renderQuizField(value: number | string, field: FieldSpec, scores: string[]) {
    return (
      <div>
        <input type="radio" name="dummy" value={value} id={`josephus-quiz-choice-${value}`} />
        <label htmlFor={`josephus-quiz-choice-${value}`}>
          {scores.map(score => (
            <josephus-snippet data={score} repr={field.repr} />
          ))}
        </label>
      </div>
    );
  }

  renderField(field: FieldSpec) {
    if (this.DO_NOT_RENDER) return <div>Rendering turned off.</div>;
    /**
     * All scores in the field.
     */
    const scores = field.scoreRefs.map(i => {
      const score: MEIDocument = this.scores[i].clone();
      const extraction = field.extractor ? score[field.extractor] : score; // HERE IS ISSUE
      field.filter.forEach(f => extraction[`${f}Filter`]());
      return extraction.toString();
    });

    switch (field.gui) {
      case 'display':
        return this.renderDisplay(field, scores);
      case 'quiz':
        return this.renderQuiz(field, scores);
      case 'connect':
        return <div>Connect GUI not implemented.</div>;
      case 'order':
        return <div>Order GUI not implemented.</div>;
      case 'selection':
        return <div>Selection GUI not implemented.</div>;
      default:
        console.warn('No GUI provided for task field.');
        field.gui satisfies never;
    }

    return <div>Cannot load field "{field.type}".</div>;
  }

  render() {
    if (!this.spec) return <div>JosephusTask: No spec provided.</div>;
    return (
      <div>
        {this.spec.fields.map(field => (
          <fieldset>
            <legend>
              <div>{field.type.toUpperCase()}</div>
              <div>{field.description ?? 'No description.'}</div>
            </legend>
            <div>{this.renderField(field)}</div>
          </fieldset>
        ))}
      </div>
    );
  }
}

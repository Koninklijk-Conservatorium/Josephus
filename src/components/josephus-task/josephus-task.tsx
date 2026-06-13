import { Component, h, State, Method, Event, EventEmitter } from '@stencil/core';
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
  @State() scores: MEIDocument[];
  @State() spec: TaskSpec | undefined;

  private DO_NOT_RENDER = false;

  @Event({ eventName: 'josephus-task-loading' })
  taskLoading: EventEmitter<{ state: JosephusTaskLoadingState }>;

  @Method()
  async load(spec: TaskSpec) {
    if (!(this.verovio && spec)) return;
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, music21j etc).
    const scores: MEIDocument[] = [];
    for await (let scoreSpec of spec.scores) {
      const source = new Score(scoreSpec);
      const score = await source.retrieve();
      this.loadData(score);
      const mei = this.getMEI();
      const doc = MEIDocument.parse(mei);
      scores.push(doc);
    }
    this.spec ??= spec;
    this.scores = scores;
  }

  async componentWillRender() {
    if (!(this.verovio && this.spec)) return;
    await this.load(this.spec);
  }

  // componentDidRender() {}

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
      const score: MEIDocument = this.scores[i];
      const extraction = field.extractor ? score[field.extractor] : score.clone();
      field.filter.forEach(f => {
        extraction[`${f}Filter`]();
      });
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

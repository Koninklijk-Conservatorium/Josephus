import { Component, h, State, Method, Event, EventEmitter } from '@stencil/core';
import { VerovioComponent } from '../../utils/VerovioComponent';
import { Score } from '../../utils/Score';

export type JosephusTaskLoadingState = 'loading' | 'loaded';

@Component({
  tag: 'josephus-task',
  styleUrl: 'josephus-task.css',
  shadow: true,
})
export class JosephusTask extends VerovioComponent {
  @State() scores: string[];
  @State() spec: TaskSpec | undefined;

  private DO_NOT_RENDER = false;

  @Event({ eventName: 'josephus-task-loading' })
  taskLoading: EventEmitter<{ state: JosephusTaskLoadingState }>;

  @Method()
  async load(spec: TaskSpec) {
    if (!(this.verovio && spec)) return;
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, music21j etc).
    const scores = [];
    for await (let scoreSpec of spec.scores) {
      const source = new Score(scoreSpec);
      const score = await source.retrieve();
      this.loadData(score);
      scores.push(this.verovio.getMEI());
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
    const scores = field.scores.map((_, i) => this.scores[i]); // TO DO: dummy score reference for now.
    switch (field.gui) {
      case 'display':
        return scores.map(score => <josephus-snippet data={score} repr={field.repr}></josephus-snippet>);
      case 'quiz':
        return this.renderQuiz(field, scores);
      default:
        console.warn('No GUI provided for task field.');
      // field.gui satisfies never;
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

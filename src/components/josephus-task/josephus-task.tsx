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

  renderField() {}

  render() {
    if (!this.spec) return <div>JosephusTask: No spec provided.</div>;
    const fields = Object.entries(this.spec.fields) as [keyof typeof this.spec.fields, FieldSpec][];
    return (
      <div>
        {fields.map(field => (
          <fieldset>
            <legend>
              <div>{field[0].toUpperCase()}</div>
              <div>{field[1]?.description ?? 'No description.'}</div>
            </legend>
            <div>
              {(() => {
                if (!this.spec) return <div>No spec provided.</div>;
                else if (!field[1]) return <div>Unknown spec: {field[0]}</div>;
                if (this.DO_NOT_RENDER) return;

                // const field = this.spec.fields[fieldName];
                const scores = field[1].scores.map((_, i) => this.scores[i]); // dummy score reference for now.
                const gui: JosephusGUI = field[1].gui ?? 'display';

                switch (gui) {
                  case 'display':
                    return scores.map(score => <josephus-snippet data={score} repr={['audio', 'label', 'score']}></josephus-snippet>);
                  case 'quiz':
                    return Array.from({ length: field[1].items }, (_, i) => i).map(i => (
                      <div>
                        <input type="radio" name="dummy" value={i} id={`josephus-quiz-choice${i}`} />
                        <label htmlFor={`josephus-quiz-choice${i}`}>
                          {scores.map(score => (
                            <josephus-snippet data={score} repr={field[1].repr} />
                          ))}
                        </label>
                      </div>
                    ));
                  default:
                  // gui satisfies never;
                }

                return <div>Cannot load field "{field[0]}".</div>;
              })()}
            </div>
          </fieldset>
        ))}
      </div>
    );
  }
}

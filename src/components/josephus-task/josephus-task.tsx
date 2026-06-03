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
    if (!spec) return;
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
    // if (!(this.verovio || this.tone)) return;

    await this.load(this.spec);
  }

  componentDidRender() {
    if (this.spec) console.log('DID1111');
  }

  componentDidLoad() {
    super.componentDidLoad();
  }

  render() {
    return (
      <div>
        {Object.keys(this.spec?.fields ?? {}).map(fieldName => (
          <fieldset>
            <legend>
              <div>{fieldName.toUpperCase()}</div>
              <div>{this.spec?.fields[fieldName]?.description ?? 'No description.'}</div>
            </legend>
            <div>
              {(() => {
                if (!this.spec) return <div>No spec provided.</div>;
                else if (!this.spec.fields[fieldName]) return <div>Unknown spec: {fieldName}</div>;
                if (this.DO_NOT_RENDER) return;

                const field = this.spec.fields[fieldName];
                const scores = field.scores.map((_, i) => this.scores[i]); // dummy score reference for now.
                const gui: JosephusGUI = field.gui ?? 'display';

                switch (gui) {
                  case 'display':
                    return scores.map(score => <josephus-snippet data={score} repr={['audio', 'label', 'score']}></josephus-snippet>);
                  case 'quiz':
                    return Array.from({ length: field.items }, (_, i) => i).map(i => (
                      <div>
                        <input type="radio" name="dummy" value={i} id={`josephus-quiz-choice${i}`} />
                        <label htmlFor={`josephus-quiz-choice${i}`}>
                          {scores.map(score => (
                            <josephus-snippet data={score} repr={field.repr} />
                          ))}
                        </label>
                      </div>
                    ));
                  default:
                  // gui satisfies never;
                }

                return <div>Cannot load field "{fieldName}".</div>;
              })()}
            </div>
          </fieldset>
        ))}
      </div>
    );
  }
}

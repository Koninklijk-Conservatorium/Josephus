import { Component, h, State, Method } from '@stencil/core';
import { toolkit as VerovioToolkit } from 'verovio';
import { VerovioComponent } from '../../utils/classes';

type ScoreSpec = {
  source: 'local' | 'remote' | 'm21j';
  path: string; // TO DO: "path?"
  params: {
    fileName: string;
    entity: 'score';
  };
};

export type ScoreRepr = 'score' | 'audio' | 'label';
type ScoreFeature = 'score' | 'pitches' | 'rhythms' | 'chords';
type ScoreLayout = 'full' | 'piano-staff' | 'single-staff';
type JosephusGUI = 'display' | 'quiz' | 'connect' | 'order' | 'selection';

type FieldSpec = {
  scores: string[]; // reference to scores loaded by task.
  repr: ScoreRepr[];
  features: ScoreFeature[];
  layout?: ScoreLayout;
  gui: JosephusGUI;
  items: number;
  events?: string[];
  description: string;
};

type TaskSpec = {
  scores: ScoreSpec[]; // List of scores, referred in fields using "#score/index".
  fields: {
    legend?: FieldSpec;
    question: FieldSpec;
    answer: FieldSpec;
  };
};

@Component({
  tag: 'josephus-task',
  styleUrl: 'josephus-task.css',
  shadow: true,
})
export class JosephusTask extends VerovioComponent {
  @State() spec: TaskSpec | undefined = {
    scores: [
      {
        source: 'remote',
        path: 'https://www.verovio.org/examples/downloads/',
        params: {
          fileName: 'Schubert_Lindenbaum.mei',
          entity: 'score',
        },
      },
      {
        source: 'remote',
        path: 'https://www.verovio.org/examples/downloads/',
        params: {
          fileName: 'Schubert_Lindenbaum.mei',
          entity: 'score',
        },
      },
    ],
    fields: {
      question: {
        scores: ['#scores/0'],
        features: ['score'],
        repr: ['score'],
        gui: 'display',
        items: 1,
        description: 'What is your answer?',
      },
      answer: {
        scores: ['#scores/0', '#scores/1'],
        features: ['score'],
        repr: ['score'],
        gui: 'quiz',
        items: 4,
        description: 'Pick an answer:',
      },
    },
  };

  @State() scores: string[];

  @State() verovio: VerovioToolkit | undefined = window.josephus?.verovio;

  private async loadRemoteData(href: string, cb: (string) => void) {
    await fetch(href)
      .then(resp => resp.text())
      .then(cb);
  }

  @Method()
  async loadData(spec: TaskSpec = this.spec) {
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, music21j etc).
    const scores = [];
    for await (let scoreSpec of spec.scores) {
      const href = scoreSpec.path + scoreSpec.params.fileName;
      await this.loadRemoteData(href, scoreTXT => scores.push(scoreTXT));
    }
    this.spec ??= spec;
    this.scores = scores;
  }

  async componentWillRender() {
    await this.loadData();
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
                const field = this.spec.fields[fieldName];
                if (!field) return <div>Unknown spec: {fieldName}</div>;

                // Load field's display.
                const scores = field.scores.map((_, i) => this.scores[i]); // dummy score reference for now.
                const gui: JosephusGUI = field.gui ?? 'display';

                switch (gui) {
                  case 'display':
                    return scores.map(score => <josephus-snippet data={score}></josephus-snippet>);
                  case 'quiz':
                    return Array.from({ length: field.items }, (_, i) =>
                      scores.map((score, i) => {
                        return (
                          <div>
                            <input type="radio" name="dummy" value={i} id={`josephus-quiz-choice${i}`} />
                            <label htmlFor={`josephus-quiz-choice${i}`}>
                              <josephus-snippet data={score} repr={field.repr} />
                            </label>
                          </div>
                        );
                      }),
                    );
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

// // Load field's display.
// const scores = field.scores.map((_, i) => this.scores[i]); // dummy score reference for now.
// const gui: JosephusGUI = field.gui ?? 'display';

// switch (gui) {
//   case 'display':
//     return scores.map(score => <josephus-snippet data={score}></josephus-snippet>);
//   case 'quiz':
//     return scores.map(score => <fieldset></fieldset>);
//   default:
//   // gui satisfies never;
// }

// return <div>Cannot load field "{fieldName}".</div>;
// }
// )}

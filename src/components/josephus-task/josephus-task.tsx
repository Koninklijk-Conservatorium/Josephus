import { Component, h, State, Method } from '@stencil/core';
import { VerovioComponent } from '../../utils/VerovioComponent';

const AVAILABLE_SOURCES = ['chorales-bach', 'chorales-praetorius'] as const;

type ScoreSpec = {
  source: (typeof AVAILABLE_SOURCES)[number];
  fileName?: string;
  entity: 'score';
};

type ResponceAPI = {
  fileNameInDir: string;
  fileContent: string;
};

type Library = {
  type: 'remote' | 'local';
  path: string; // URL
  fileNamePattern: string; // Regexp
  resp: ResponceAPI;
};

const githubResp: ResponceAPI = {
  fileNameInDir: 'name',
  fileContent: 'content',
};

const libraries: Record<string, Library> = {
  'chorales-bach': {
    type: 'remote',
    path: 'https://api.github.com/repos/DDMAL/Flexible_harmonic_chorale_annotations/contents/kernData',
    fileNamePattern: 'Chorales_Bach_\\d\\d\\d\\.krn',
    resp: githubResp,
  },
  'chorales-praetorius': {
    type: 'remote',
    path: 'https://api.github.com/repos/DDMAL/Flexible_harmonic_chorale_annotations/contents/kernData',
    fileNamePattern: 'Chorales_Praetorius_\\d\\d\\d\\.krn',
    resp: githubResp,
  },
};

class MusicSource {
  private lib: (typeof libraries)[string];
  constructor(public spec: ScoreSpec) {
    console.log(spec.source);
    this.lib = libraries[spec.source];
  }

  async retrieve() {
    const resp = this.lib.resp;
    const fileName =
      this.spec.fileName ??
      (await (async () => {
        const p = new RegExp(this.lib.fileNamePattern);
        const filesAll = await fetch(this.lib.path).then(r => r.json());
        const files = filesAll.filter(f => p.test(f[resp.fileNameInDir]));
        const index = (Math.random() * files.length) | 0;
        const file = files[index];
        return file.name;
      })());
    const href = this.lib.path + '/' + fileName;
    const file = await fetch(href).then(resp => resp.json());
    return atob(file[resp.fileContent]); // .content: github API specific.
  }
}

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
        source: 'chorales-praetorius',
        // fileName: 'Chorales_Bach_093.krn',
        // path: 'https://www.verovio.org/examples/downloads/',
        // fileName: 'Schubert_Lindenbaum.mei',
        entity: 'score',
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
        items: 2,
        description: 'Pick an answer:',
      },
    },
  };

  @State() scores: string[];

  private DO_NOT_RENDER = false;

  private async loadRemoteData(href: string, cb: (string) => void) {
    await fetch(href)
      .then(resp => resp.text())
      .then(cb);
  }

  @Method()
  async load(spec: TaskSpec) {
    // const scoresTXT = spec.scores.map(scoreSpec => {
    // This function should handle various data retrieval methods (files, music21j etc).
    const scores = [];
    for await (let scoreSpec of spec.scores) {
      const source = new MusicSource(scoreSpec);
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
                    return scores.map(score => <josephus-snippet data={score}></josephus-snippet>);
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

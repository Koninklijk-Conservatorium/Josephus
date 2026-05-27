import { Component, h, State, Method, Listen } from '@stencil/core';

type TaskFieldSpec = {
  entity: string; // entity reference
  repr: 'score' | 'audio' | 'label';
  feature?: 'rhythm' | 'pitches';
  gui?: 'quiz' | 'connect' | 'order' | 'selection';
  items?: number;
  events?: string[];
  description?: string;
};

type TaskSpec = {
  entities: { href: string }[]; // List of entities, referred in fields using "#entities/index".
  fields: {
    legend?: TaskFieldSpec;
    question: TaskFieldSpec;
    answer: TaskFieldSpec;
  };
};

@Component({
  tag: 'josephus-task',
  styleUrl: 'josephus-task.css',
  shadow: true,
})
export class JosephusTask {
  @State() spec: TaskSpec | undefined = {
    entities: [{ href: 'https://www.verovio.org/examples/downloads/Schubert_Lindenbaum.mei' }],
    fields: {
      question: {
        entity: '...',
        repr: 'score',
      },
      answer: {
        entity: '...',
        repr: 'score',
      },
    },
  };

  @Method()
  async loadData(spec?: TaskSpec) {
    this.spec = spec;
  }

  render() {
    return (
      <div>
        {Object.keys(this.spec?.fields ?? {}).map(fieldName => {
          if (!this.spec) return <div>No spec provided.</div>;
          const field = this.spec.fields[fieldName];
          if (!field) return <div>Unknown spec: {fieldName}</div>;
          const entity = this.spec.entities[0];
          const snippet = <josephus-snippet href={entity.href}></josephus-snippet>;
          return snippet;
        })}
      </div>
    );
  }
}

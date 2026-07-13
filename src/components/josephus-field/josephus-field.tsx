import { Component, Prop, h } from '@stencil/core';
import { MEIDocument } from '../../utils/mei';
import { VerovioComponent } from '../../utils/VerovioComponent';

@Component({
  tag: 'josephus-field',
  styleUrl: 'josephus-field.css',
  shadow: true,
})
export class JosephusField extends VerovioComponent {

  private DO_NOT_RENDER = false;

  @Prop() spec: FieldSpec | undefined
  @Prop() scores: StringMEI[][] = [] // TO DO: MEI String!


  componentDidLoad() {
    super.componentDidLoad();
  }

  handleDisplay(field: FieldSpec, scores: string[]) {
    return scores.map(score => <josephus-snippet data={score} repr={field.repr}></josephus-snippet>);
  }

  handleQuizField(value: number | string, field: FieldSpec, scores: string[]) {
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

  handleQuiz(field: FieldSpec, scores: string[]) {
    return Array.from({ length: field.items }, (_, i) => i).map(i => this.handleQuizField(i, field, scores));
  }


  handle(field: FieldSpec) {
    if (this.DO_NOT_RENDER) return <div>Rendering turned off.</div>;
    /**
     * All scores in the field.
     */
    const scores = field.scoreRefs.map(i => {
      const score: StringMEI = this.scores[i][0]; // [0] for now.
      // Here apply XSLT filters.
      this.loadData(score)
      // this.verovio!.select()
      const mei = this.getMEI() // does it work with 'select'?
      const doc = MEIDocument.parse(mei)
      const extraction = field.extractor ? doc[field.extractor] : doc; // HERE IS ISSUE
      field.filter.forEach(f => extraction[`${f}Filter`]());
      return extraction.toString();
    });

    switch (field.gui) {
      case 'display':
        return this.handleDisplay(field, scores);
      case 'quiz':
        return this.handleQuiz(field, scores);
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
    if (!this.spec) return <div>JosephusField: No spec provided.</div>;
    return <fieldset>
      <legend>
        <div>{this.spec.type.toUpperCase()}</div>
        <div>{this.spec.description ?? 'No description.'}</div>
      </legend>
      <div>{this.handle(this.spec)}</div>
    </fieldset>
  }
}

import { Component, Prop, h } from '@stencil/core';
import { MEIParser } from '../../utils/MEIParser';

@Component({
  tag: 'josephus-field',
  styleUrl: 'josephus-field.css',
  shadow: true,
})
export class JosephusField {

  private DO_NOT_RENDER = false;

  @Prop() spec: FieldSpec | undefined
  @Prop() scores: StringMEI[][] = [] // TO DO: MEI String!

  /**
   * Turn all the received scores into
   *
   * THIS CANNOT EVER BE ASYNC!
   * I use only one Verovio toolkit instance for the whole app...
   */
  componentWillRender() {
    if (!this.spec) return
    this.scores = this.spec.scoreRefs.map(i => {
      // TO DO: score vs score[]
      const score: StringMEI = this.scores[i][0]; // [0] for now.
      const doc = new MEIParser(this.spec!.transforms).parseFromString(score)
      const scoreTransformed = new XMLSerializer().serializeToString(doc)
      // this.verovio!.select()
      // const mei = this.getMEI() // does it work with 'select'?
      // const doc = MEIDocument.parse(mei)
      // const extraction = field.extractor ? doc[field.extractor] : doc; // HERE IS ISSUE
      // field.filter.forEach(f => extraction[`${f}Filter`]());
      // return
      return [scoreTransformed as StringMEI]
    });
  }

  handleDisplay() {
    return this.scores.map(score => <josephus-snippet data={score[0]} repr={this.spec!.repr}></josephus-snippet>);
  }

  handleQuizField(value: number | string) {
    return (
      <div>
        <input type="radio" name="dummy" value={value} id={`josephus-quiz-choice-${value}`} />
        <label htmlFor={`josephus-quiz-choice-${value}`}>
          {this.scores.map(score => (
            <josephus-snippet data={score[0]} repr={this.spec!.repr} />
          ))}
        </label>
      </div>
    );
  }

  handleQuiz() {
    return Array.from({ length: this.spec!.items }, (_, i) => i).map(i => this.handleQuizField(i));
  }


  handle() {
    if (this.DO_NOT_RENDER) return <div>Rendering turned off.</div>;
    if (!this.spec) return <div>Josephus Field: spec not provided.</div>

    switch (this.spec.gui) {
      case 'display':
        return this.handleDisplay();
      case 'quiz':
        return this.handleQuiz();
      case 'connect':
        return <div>Connect GUI not implemented.</div>;
      case 'order':
        return <div>Order GUI not implemented.</div>;
      case 'selection':
        return <div>Selection GUI not implemented.</div>;
      default:
        console.warn('No GUI provided for task field.');
        this.spec.gui satisfies never;
    }

    return <div>Cannot load field "{this.spec.type}".</div>;
  }

  render() {
    if (!this.spec) return <div>JosephusField: No spec provided.</div>;
    return <fieldset>
      <legend>
        <div>{this.spec.type.toUpperCase()}</div>
        <div>{this.spec.description ?? 'No description.'}</div>
      </legend>
      <div>{this.handle()}</div>
    </fieldset>
  }
}

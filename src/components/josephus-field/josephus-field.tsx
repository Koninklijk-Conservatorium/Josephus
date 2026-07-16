import { Component, Prop, h } from '@stencil/core';
import { MEIParser } from '../../utils/MEIParser';
import { element, elements } from '../../utils/random';


@Component({
  tag: 'josephus-field',
  styleUrl: 'josephus-field.css',
  shadow: true,
})
export class JosephusField {

  @Prop() spec: FieldSpec | undefined
  @Prop() scores: ScoreData[] = []//StringMEI[] = [] // TO DO: MEI String!
  @Prop() snippets: Snippet[] = []

  private DO_NOT_RENDER = false;

  /**
   * Turn all the received scores into
   *
   * THIS CANNOT EVER BE ASYNC!
   * I use only one Verovio toolkit instance for the whole app...
   */
  componentWillRender() {
    if (!this.spec) return
    this.scores.forEach(data => {
      const doc = new MEIParser(this.spec!.transforms).parseFromString(data.mei)
      const scoreTransformed = new XMLSerializer().serializeToString(doc)
      data.mei = scoreTransformed
      data.segments = doc.selections
    });
    this.snippets.length = 0
    this.getSnippets().forEach(snippet => this.snippets.push(snippet))
  }

  /**
   * Prepare score snippet for displayer.
   * @returns
   */
  private getSnippets(): Snippet[] {
    if (!this.spec) return [{ mei: '', segment: { measureRange: { measureRange: 'start-end' } }}]
    if (this.scores.length < 1) return []
    const singleScore = this.scores.length === 1
    const items = !singleScore ? this.scores : this.scores[0].segments
    const n = typeof this.spec.items === 'number' ? this.spec.items : { all: items.length }[this.spec.items]
    if (singleScore) {
      const score = this.scores[0]
      const arr = score.segments.map(segment => ({
        mei: score.mei,
        segment: segment
      }))
      // return elements(arr, n)
      return arr.slice(0, n)
    }
    const arr = this.scores.map(score => ({
      mei: score.mei,
      segment: element(score.segments)
    }))
    return elements(arr, n)
  }

  handleDisplay() {
    return this.snippets.map(snippet => <josephus-snippet data={snippet.mei} select={snippet.segment} repr={this.spec!.repr}></josephus-snippet>);
  }

  handleQuizField(i: number) {
    const snippet = this.snippets[i]
    return (
      <div>
        <input type="radio" name="dummy" value={i} id={`josephus-quiz-choice-${i}`} />
        <label htmlFor={`josephus-quiz-choice-${i}`}>
          <josephus-snippet data={snippet.mei} select={snippet.segment} repr={this.spec!.repr} />
        </label>
      </div>
    );
  }

  handleQuiz() {
    return Array.from({ length: this.snippets.length }, (_, i) => i).map(i => this.handleQuizField(i));
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

import { MEITransform } from "./MEITransform";

abstract class MEIFilter extends MEITransform {}

export class MEIAccidentalsFilter extends MEIFilter {
  constructor() { super() }
  transform(mei: MEIDocument): MEIDocument {
    const attrsRedundant = ['key.sig', 'keysig', 'accid', 'accid.ges'];
    attrsRedundant.forEach(attrName =>
      this.select(`//*[@${attrName}]`, mei).forEach(tag =>
        tag.removeAttribute(attrName)
      )
    )
    const tagsRedundant = ['accid', 'keySig'];
    tagsRedundant.forEach(tagName =>
      this.select(`//${tagName}`, mei).forEach(tag =>
        tag.parentNode?.removeChild(tag)
      )
    )
    return mei
  }
}

export class MEIDurationsFilter extends MEIFilter {
  constructor() { super() }
  transform(mei: MEIDocument): MEIDocument {
    /* Remove dots, but leave their effect. */
    this.select('//*[@dots]', mei).forEach(tag => {
      const dots = tag.getAttribute('dots') ?? 0;
      if (dots) {
        if (tag.getAttribute('dots.ges')) {
          tag.setAttribute('dots.ges', dots);
        }
        tag.removeAttribute('dots');
      }
    });
    this.select('//mei:note|//mei:chord', mei).forEach(note => {
      note.setAttribute('stem.visible', 'false');
    });
    this.select('//mei:beam', mei).forEach(beam => {
      const parent = beam.parentNode!;
      let child: Node | null;
      while ((child = beam.firstChild) !== null) {
        parent.insertBefore(child, beam);
      }
      beam.remove();
    });
    this.select('//mei:tuplet', mei).forEach(note => {
      note.setAttribute('num.visible', 'false');
      note.setAttribute('bracket.visible', 'false');
    });
    this.select('//mei:note', mei).forEach(note => {
      note.setAttribute('head.shape', 'quarter');
    });
    // TO DO: rests.
    return mei
  }
}

export class MEIPitchesFilter extends MEIFilter {
  constructor() { super() }
  transform(mei: MEIDocument): MEIDocument {
    this.select('//mei:staffDef', mei).forEach(def => {
      def.setAttribute('lines', '1');
      def.setAttribute('clef.shape', 'perc');
      def.removeAttribute('clef.line');
    });
    this.select('//mei:note', mei).forEach(note => {
      note.setAttribute('loc', '0');
    });
    return mei
  }
}

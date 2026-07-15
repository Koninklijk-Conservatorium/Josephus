import { MEITransform } from "./MEITransform";

abstract class MEIExtractor extends MEITransform {
  protected unique<E extends Element, Encoding extends any>(elems: E[], encode: (e: E) => Encoding, decode: (e: Encoding) => E, sorted: boolean): E[] {
    const unique = new Set<Encoding>();
    elems.map((e: E) => unique.add(encode(e)));
    return sorted ? Array.from(unique).sort().map(decode) : Array.from(unique).map(decode);
  }
}

export class MEIPitchExtractor extends MEIExtractor {

  transform(mei: MEIDocument): MEIDocument {
    const notes = this.select('//mei:note', mei) as MEINoteElement[];
    const uniquePitches = this.extractPitches(notes, true, true);
    const snippet = this.createSnippet(uniquePitches);
    // TO DO: make it simpler?
    this.select("//mei:mei", mei).forEach(tag => {
      tag.replaceWith(this.select("//mei:mei", snippet)[0])
    })
    return mei;
  }

  private static pitchNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

  private encodePitch(note: MEINoteElement): string {
    const pname = note.getAttribute('pname');
    const accid = (note.getAttribute('accid.ges') || note.getAttribute('accid')) ?? '';
    const oct = note.getAttribute('oct');
    return `${oct} ${MEIPitchExtractor.pitchNames.indexOf(pname!)} ${accid}`;
  }

  private decodePitch(pcode: string): MEINoteElement {
    // TO DO: move elsewhere.
    /* Create 'note' as container for data */
    const note = document.createElement('note') as MEINoteElement;
    note.setAttribute('dur', '4');
    note.setAttribute('stem.len', '0');
    /* Decode data */
    const [oct, pindex, accid] = pcode.split(' ');
    note.setAttribute('oct', oct);
    note.setAttribute('pname', MEIPitchExtractor.pitchNames[Number(pindex)]);
    if (accid !== 'n') {
      note.setAttribute('accid', accid);
      note.setAttribute('accid.ges', accid);
    }
    return note;
  }

  private extractPitches(notes: MEINoteElement[], unique: boolean, sorted: boolean): MEINoteElement[] {
    if (unique) {
      return this.unique(notes, this.encodePitch, this.decodePitch, sorted);
    } else if (sorted) {
      return notes.map(this.encodePitch).sort().map(this.decodePitch);
    }
    return notes.map(this.encodePitch).map(this.decodePitch);
  }

}

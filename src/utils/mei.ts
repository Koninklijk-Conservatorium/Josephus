import { MEIPitchExtractor } from './mei-extractors';

/*
  TO DO:
  – turn all createElement to createElementNS

*/

type ScoreExtractor = "pitches" | "segments"
type ScoreFeature = "accidentals" | "articulations" | "pitches" | "durations"


type MEIScoreExtractors = {
  readonly [E in ScoreExtractor]: MEIDocument;
};

type MEIScoreFeatureFilters = {
  [F in ScoreFeature as `${F}Filter`]: () => void;
};

/**
 * Document with additional MEI-focused utilities.
 */
export class MEIDocument extends Document implements MEIScoreExtractors, MEIScoreFeatureFilters {
  private static parser = new DOMParser();
  private static serializer = new XMLSerializer();
  private static namespace: Record<string, string> = {
    mei: 'http://www.music-encoding.org/ns/mei',
    xml: 'http://www.w3.org/XML/1998/namespace',
  };
  private static nsResolver(prefix: string | null): string | null {
    if (prefix === null) return null;
    return MEIDocument.namespace[prefix] ?? null;
  }

  // TO DO: Turn to public (?) factory and merge with createSnippet
  private static snippet = `
    <mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.1">
      <meiHead>
        <fileDesc>
          <titleStmt>
            <title>Josephus Snippet</title>
          </titleStmt>
          <pubStmt/>
        </fileDesc>
      </meiHead>
      <music>
        <body>
          <mdiv>
            <score>
              <scoreDef>
                <staffGrp>
                  <staffDef n="1" lines="5" clef.shape="G" clef.line="2"/>
                  <staffDef n="2" lines="5" clef.shape="F" clef.line="4"/>
                </staffGrp>
              </scoreDef>
              <section>
                <measure n="1">
                  <staff n="1">
                    <layer n="1">
                      <!-- Your music goes here. -->
                    </layer>
                  </staff>
                  <staff n="2">
                    <layer n="1">
                      <!-- Your music goes here. -->
                    </layer>
                  </staff>
                </measure>
              </section>
            </score>
          </mdiv>
        </body>
      </music>
    </mei>
  `;

  public static parse(mei: string): MEIDocument {
    const doc: Document = MEIDocument.parser.parseFromString(mei, 'text/xml');
    Object.setPrototypeOf(doc, MEIDocument.prototype);
    return doc as MEIDocument;
  }

  // public static fromTemplate(template: TemplateSpec) {
  //   const snippet = MEIDocument.snippet.clone();
  //   return snippet;
  // }

  private find(xpath: string) {
    return this.evaluate(xpath, this, MEIDocument.nsResolver, XPathResult.ANY_TYPE);
  }

  private iter(res: XPathResult, cb: (node: Element) => void = console.log): void {
    let node: Element | null = null;
    while ((node = res.iterateNext() as Element | null)) {
      cb(node);
    }
  }

  private map(xpath: string, cb: (node: Element) => void = console.log): XPathResult {
    const res = this.find(xpath);
    this.iter(res, cb);
    return res;
  }

  private list(xpath: string) {
    const list: Element[] = [];
    this.map(xpath, e => list.push(e));
    return list;
  }

  // private bottom(): Element {
  //   let elem: Element = this.documentElement;
  //   while (elem) {
  //     const child = elem.lastElementChild;
  //     if (!child) break;
  //     elem = child;
  //   }
  //   return elem;
  // }

  private createSnippet(content: Element[]): MEIDocument {
    const doc = MEIDocument.parse(MEIDocument.snippet);

    const [upper, lower] = doc.list('//mei:staff/mei:layer');

    for (let c of content) {
      if (Number(c.getAttribute('oct') ?? '4') < 4) {
        lower.appendChild(c);
        upper.appendChild(doc.createElement('space'));
      } else {
        upper.appendChild(c);
        lower.appendChild(doc.createElement('space'));
      }
    }

    return doc as MEIDocument;
  }

  toString(doc?: MEIDocument): string {
    return MEIDocument.serializer.serializeToString(doc ?? this);
  }
  clone(): MEIDocument {
    const clone = this.cloneNode(true);
    Object.setPrototypeOf(clone, MEIDocument.prototype);
    return clone as MEIDocument;
  }

  /*
      Extractors.
  */

  get pitches(): MEIDocument {
    const notes = this.list('//mei:note') as MEINoteElement[];
    const extractor = new MEIPitchExtractor();

    const uniquePitches = extractor.pitches(notes, true, true);
    const snippet = this.createSnippet(uniquePitches);
    return snippet;
  }

  get chords(): MEIDocument {
    return this;
  }

  get segments(): MEIDocument {
    return this;
  }

  get chordsWithFermata(): MEIDocument {
    const verovio = window.josephus.verovio; // BAD AS HELL!!!
    const score = MEIDocument.serializer.serializeToString(this);
    verovio.loadData(score);

    const fermataTimes = new Set<number>();
    const fermatas = this.find('//mei:fermata');
    this.iter(fermatas, fermata => {
      const noteId = fermata.getAttribute('startid') ?? '';
      if (!noteId) return;
      const time = verovio.getTimesForElement(noteId.slice(1));
      const scoreTimeOffset = time.scoreTimeOffset;
      // fermataTimes.add(time.tstampOn[0]);
      fermataTimes.add(scoreTimeOffset);
    });

    const chords: MEINoteElement[][] = [];
    for (let tstamp of fermataTimes) {
      const els = verovio?.getElementsAtTime(tstamp);
      const chord: MEINoteElement[] = [];
      for (let noteId of els.notes) {
        const notes = this.find(`//mei:note[@xml:id='${noteId}']`);
        this.iter(notes, note => chord.push(note as MEINoteElement));
      }
      chords.push(chord);
    }

    const snippet = this.createSnippet(
      chords.map(chord => {
        const chordMEI = this.createElement('chord') as Element;
        chordMEI.setAttribute('stem.len', '0');
        chord.forEach((note: MEINoteElement) => chordMEI.appendChild(note));
        return chordMEI;
      }),
    );

    console.log(chords);

    return snippet;
  }

  /*
      Filters

      TO DO 1: refactor in such a way, that:
      – a 'filter' is a set of actions: "what is done to which tag?"
      – filters are passed as string values (as they are in the spec)
      – they 'accumulate' and all the removal is done in one method 'filter(features:ScoreFeature[])

      TO DO 2: Check, if those 'layout' features can be removed in Verovio during rendering.
      TO DO 3: make filters into more "basic" ones (e.g. dot removal) and combinedd (e.g. durations, removing dots, tupltes, stems etc)
      TO DO 4: allow for custom user-defined filters
  */

  public accidentalsFilter(): void {
    const attrsRedundant = ['key.sig', 'keysig', 'accid', 'accid.ges'];
    attrsRedundant.forEach(attr =>
      this.list(`//*[@${attr}]`).forEach(tag => {
        tag.removeAttribute(attr);
      }),
    );
  }

  public articulationsFilter(): void {
    console.warn('Articulations filter: not implemented.');
  }
  // And: slurs, dynamic sings etc...

  public durationsFilter(): void {
    /* Remove dots, but leave their effect. */
    this.list('//*[@dots]').forEach(tag => {
      const dots = tag.getAttribute('dots') ?? 0;
      if (dots) {
        if (tag.getAttribute('dots.ges')) {
          tag.setAttribute('dots.ges', dots);
        }
        tag.removeAttribute('dots');
      }
    });
    this.list('//mei:note|//mei:chord').forEach(note => {
      note.setAttribute('stem.visible', 'false');
    });
    this.list('//mei:beam').forEach(beam => {
      const parent = beam.parentNode!;
      let child: Node | null;
      while ((child = beam.firstChild) !== null) {
        parent.insertBefore(child, beam);
      }
      beam.remove();
    });
    this.list('//mei:tuplet').forEach(note => {
      note.setAttribute('num.visible', 'false');
      note.setAttribute('bracket.visible', 'false');
    });
    this.list('//mei:note').forEach(note => {
      note.setAttribute('head.shape', 'quarter');
    });
    // TO DO: rests.
  }

  public pitchesFilter(): void {
    this.list('//mei:staffDef').forEach(def => {
      def.setAttribute('lines', '1');
      def.setAttribute('clef.shape', 'perc');
      def.removeAttribute('clef.line');
    });
    this.list('//mei:note').forEach(note => {
      note.setAttribute('loc', '0');
    });
  }
}

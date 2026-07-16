import { MEIParser } from "./MEIParser";

const SNIPPET:StringMEI = `
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



export class MEIQuery {

  private static namespace: Record<string, string> = {
    mei: 'http://www.music-encoding.org/ns/mei',
    xml: 'http://www.w3.org/XML/1998/namespace',
  };

  private static nsResolver(prefix: string | null): string | null {
    if (prefix === null) return null;
    return MEIQuery.namespace[prefix] ?? null;
  }

  select(xpath: string, mei: MEIDocument): Element[] {
    const evaluator = new XPathEvaluator();
    const expression = evaluator.createExpression(xpath, MEIQuery.nsResolver);
    const result = expression.evaluate(mei, XPathResult.ANY_TYPE)
    // const result = mei.evaluate(xpath, mei, MEIQuery.nsResolver, XPathResult.ANY_TYPE)
    const nodes: Node[] = []
    let node: Node | null;
    while ((node = result.iterateNext())) nodes.push(node)
    return nodes as Element[]
    // TO DO: try using SNAPSHOT as XPathResult, and then apply callbacks while iterating.
  }

  createSnippet(elems: Element[]): MEIDocument {
    const mei = new MEIParser([]).parseFromString(SNIPPET)
    const [upper, lower] = this.select('//mei:staff/mei:layer', mei);

    for (let e of elems) {
      if (Number(e.getAttribute('oct') ?? '4') < 4) {
        lower.appendChild(e);
        upper.appendChild(mei.createElement('space'));
      } else {
        upper.appendChild(e);
        lower.appendChild(mei.createElement('space'));
      }
    }

    return mei
  }

}

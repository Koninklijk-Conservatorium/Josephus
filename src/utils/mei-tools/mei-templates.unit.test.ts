import { describe, it, expect } from 'vitest';
import Mustache from 'mustache';

describe('MEITemplate', () => {
  it('templates xml.', () => {
    type StringXML = string;

    const template: StringXML = `
    <chord>
     <note1 oct="{{note1.oct}}" pname="{{note1.pname}}"/>
     <note2 oct="{{note2.oct}}" pname="{{note2.pname}}"/>
    </chord>/>
    `;

    // Mustache.render
    const chord = Mustache.render(template, {
      note1: {
        oct: 4,
        pname: 'a',
      },
      note2: {
        oct: 5,
        pname: 'f',
      },
    });
    expect(chord).toEqual(`
    <chord>
     <note1 oct="4" pname="a"/>
     <note2 oct="5" pname="f"/>
    </chord>/>
    `);
  });
});

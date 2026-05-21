import { newSpecPage } from '@stencil/core/testing';
import { JosephusSnippet } from '../josephus-snippet';

describe('josephus-snippet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusSnippet],
      html: `<josephus-snippet></josephus-snippet>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-snippet>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-snippet>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { JosephusField } from '../josephus-field';

describe('josephus-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusField],
      html: `<josephus-field></josephus-field>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-field>
    `);
  });
});

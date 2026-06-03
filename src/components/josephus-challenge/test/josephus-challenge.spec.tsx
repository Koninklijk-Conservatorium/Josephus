import { newSpecPage } from '@stencil/core/testing';
import { JosephusChallenge } from '../josephus-challenge';

describe('josephus-challenge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusChallenge],
      html: `<josephus-challenge></josephus-challenge>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-challenge>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-challenge>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { JosephusTimer } from '../josephus-timer';

describe('josephus-timer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusTimer],
      html: `<josephus-timer></josephus-timer>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-timer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-timer>
    `);
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { JosephusTask } from '../josephus-task';

describe('josephus-task', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusTask],
      html: `<josephus-task></josephus-task>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-task>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-task>
    `);
  });
});

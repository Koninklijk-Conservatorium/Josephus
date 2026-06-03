import { newSpecPage } from '@stencil/core/testing';
import { JosephusExam } from '../josephus-exam';

describe('josephus-exam', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusExam],
      html: `<josephus-exam></josephus-exam>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-exam>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-exam>
    `);
  });
});

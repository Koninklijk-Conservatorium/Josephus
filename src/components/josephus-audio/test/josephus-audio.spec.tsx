import { newSpecPage } from '@stencil/core/testing';
import { JosephusAudio } from '../josephus-audio';

describe('josephus-audio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [JosephusAudio],
      html: `<josephus-audio></josephus-audio>`,
    });
    expect(page.root).toEqualHtml(`
      <josephus-audio>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </josephus-audio>
    `);
  });
});

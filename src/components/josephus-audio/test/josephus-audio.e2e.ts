import { newE2EPage } from '@stencil/core/testing';

describe('josephus-audio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-audio></josephus-audio>');

    const element = await page.find('josephus-audio');
    expect(element).toHaveClass('hydrated');
  });
});

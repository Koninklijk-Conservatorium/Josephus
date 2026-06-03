import { newE2EPage } from '@stencil/core/testing';

describe('josephus-challenge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-challenge></josephus-challenge>');

    const element = await page.find('josephus-challenge');
    expect(element).toHaveClass('hydrated');
  });
});

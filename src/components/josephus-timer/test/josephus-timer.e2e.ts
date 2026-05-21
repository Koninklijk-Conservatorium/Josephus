import { newE2EPage } from '@stencil/core/testing';

describe('josephus-timer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-timer></josephus-timer>');

    const element = await page.find('josephus-timer');
    expect(element).toHaveClass('hydrated');
  });
});

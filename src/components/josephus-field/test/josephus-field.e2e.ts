import { newE2EPage } from '@stencil/core/testing';

describe('josephus-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-field></josephus-field>');

    const element = await page.find('josephus-field');
    expect(element).toHaveClass('hydrated');
  });
});

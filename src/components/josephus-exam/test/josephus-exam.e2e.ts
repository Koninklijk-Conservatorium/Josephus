import { newE2EPage } from '@stencil/core/testing';

describe('josephus-exam', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-exam></josephus-exam>');

    const element = await page.find('josephus-exam');
    expect(element).toHaveClass('hydrated');
  });
});

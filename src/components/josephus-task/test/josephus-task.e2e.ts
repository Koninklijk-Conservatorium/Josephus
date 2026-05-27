import { newE2EPage } from '@stencil/core/testing';

describe('josephus-task', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-task></josephus-task>');

    const element = await page.find('josephus-task');
    expect(element).toHaveClass('hydrated');
  });
});

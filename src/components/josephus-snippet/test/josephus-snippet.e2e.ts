import { newE2EPage } from '@stencil/core/testing';

describe('josephus-snippet', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<josephus-snippet></josephus-snippet>');

    const element = await page.find('josephus-snippet');
    expect(element).toHaveClass('hydrated');
  });
});

// TEST: .data displayed when provided.
// TEST: href display .ref when no .data provided

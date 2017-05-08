import { V4.1Page } from './app.po';

describe('v4.1 App', () => {
  let page: V4.1Page;

  beforeEach(() => {
    page = new V4.1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

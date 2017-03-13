import { V2.4Page } from './app.po';

describe('v2.4 App', () => {
  let page: V2.4Page;

  beforeEach(() => {
    page = new V2.4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

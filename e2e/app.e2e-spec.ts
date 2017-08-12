import { IplMatchPage } from './app.po';

describe('ipl-match App', () => {
  let page: IplMatchPage;

  beforeEach(() => {
    page = new IplMatchPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

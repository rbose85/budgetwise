import { BudgetwisePage } from './app.po';

describe('budgetwise App', function() {
  let page: BudgetwisePage;

  beforeEach(() => {
    page = new BudgetwisePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

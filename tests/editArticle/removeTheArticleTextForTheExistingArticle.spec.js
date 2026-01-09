import { test } from '@playwright/test';
import { HomePage } from '../../src/ui/pages/HomePage';
import { CreateArticlePage } from '../../src/ui/pages/article/CreateArticlePage';
import { ViewArticlePage } from '../../src/ui/pages/article/ViewArticlePage';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { generateNewArticleData } from '../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { BODY_CANNOT_BE_EMPTY } from '../../src/ui/constants/articleErrorMessages';

let homePage;
let createArticlePage;
let viewArticlePage;
let article;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  createArticlePage = new CreateArticlePage(page);
  viewArticlePage = new ViewArticlePage(page);

  article = generateNewArticleData();
  const user = generateNewUserData();

  await signUpUser(page, user);
});

test('Add the tag for the existing article without tags', async () => {
  await homePage.clickNewArticleLink();
  await createArticlePage.fillTitleField(article.title);
  await createArticlePage.fillDescriptionField(article.description);
  await createArticlePage.fillTextField(article.text);
  await createArticlePage.fillTagField(article.tag);
  await createArticlePage.clickPublishArticleButton();
  await createArticlePage.clickPublishArticleButton();

  await viewArticlePage.assertArticleTitleIsVisible(article.title);
  await viewArticlePage.clickEditArticleButton();
  await createArticlePage.fillTextField('');
  await viewArticlePage.clickUpdateArticleButton();

  await createArticlePage.assertErrorMessageContainsText(BODY_CANNOT_BE_EMPTY);
});

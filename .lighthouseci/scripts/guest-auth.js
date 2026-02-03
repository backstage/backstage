'use strict';

module.exports = async (browser, context) => {
  // launch browser for LHCI
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
  });
};

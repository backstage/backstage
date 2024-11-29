/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test } from '@playwright/test';

/**
 * Calling this at the top of your test file will ensure that tests fail if the browser
 * logs any errors or if there are any uncaught exceptions.
 *
 * @public
 */
export function failOnBrowserErrors(): void {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', error => {
      throw new Error(`Uncaught exception on page, ${error}`);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        throw new Error(`Unexpected console error message "${msg.text()}"`);
      }
    });
  });
}

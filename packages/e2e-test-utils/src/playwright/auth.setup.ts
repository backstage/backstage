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

import { test as setup } from '@playwright/test';
import fs from 'fs-extra';
import { dirname } from 'path';

const storageStatePath = '.auth/user.json';

setup('authenticate as guest', async ({ page }) => {
  // Navigate to Backstage
  await page.goto('/');

  // Wait for the application to load
  await page.waitForSelector('[data-testid="sidebar"]', { timeout: 60000 });

  // Ensure directory exists
  await fs.ensureDir(dirname(storageStatePath));

  // Save authentication state
  await page.context().storageState({ path: storageStatePath });
});

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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const userSettingsTranslationRef = createTranslationRef({
  id: 'user-settings',
  messages: {
    languageToggle: {
      title: 'Language',
      description: 'Change the language',
      select: 'Select language {{language}}',
    },
    themeToggle: {
      title: 'Theme',
      description: 'Change the theme mode',
      select: 'Select theme {{theme}}',
      selectAuto: 'Select Auto Theme',
      names: {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
      },
    },
  },
});

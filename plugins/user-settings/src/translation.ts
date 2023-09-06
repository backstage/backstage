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
    language: 'Language',
    change_the_language: 'Change the language',
    theme: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_auto: 'Auto',
    change_the_theme_mode: 'Change the theme mode',
    select_theme_light: 'Select light',
    select_theme_dark: 'Select dark',
    select_theme_auto: 'Select Auto Theme',
    select_theme_custom: 'Select {{custom}}',
    lng: '{{language}}',
    select_lng: 'Select language {{language}}',
  },
});

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

import { createTranslationRef } from '@backstage/core-plugin-api';

export const settingsTranslationRef = createTranslationRef({
  id: 'settings',
  resources: {
    en: {
      lng: 'English',
      select: 'Select',
      language: 'Language',
      select_lng: 'Select English',
      change_the_language: 'Change the language',
    },
    zh: {
      lng: '中文',
      select: '选择',
      language: '语言',
      select_lng: '选择中文',
      change_the_language: '选择语言',
      theme_light: '浅色主题',
      theme_dark: '深色主题',
      theme_auto: '自动主题',
      select_theme_light: '选择浅色主题',
      select_theme_dark: '选择深色主题',
      select_theme_auto: '选择自动主题',
    },
  },
});

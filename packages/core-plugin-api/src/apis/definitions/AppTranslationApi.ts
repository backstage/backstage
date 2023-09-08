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

import { type i18n } from 'i18next';
import { TranslationRef } from '../../translation';
import { ApiRef, createApiRef } from '@backstage/core-plugin-api';

/** @alpha */
export type AppTranslationApi = {
  getI18n(): i18n;

  addResourcesByRef<TMessages extends Record<string, string>>(
    translationRef: TranslationRef<TMessages>,
  ): void;
};

/**
 * @alpha
 */
export const appTranslationApiRef: ApiRef<AppTranslationApi> = createApiRef({
  id: 'core.translation',
});

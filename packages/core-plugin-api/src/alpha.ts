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

// Translation exports
export {
  type TranslationMessages,
  type TranslationMessagesOptions,
  createTranslationMessages,
  type TranslationResource,
  type TranslationResourceOptions,
  createTranslationResource,
  type TranslationRef,
  type TranslationRefOptions,
  createTranslationRef,
  useTranslationRef,
} from '@backstage/frontend-plugin-api';

// API definition exports
export {
  appLanguageApiRef,
  type AppLanguageApi,
  translationApiRef,
  type TranslationApi,
  type TranslationFunction,
  type TranslationSnapshot,
} from '@backstage/frontend-plugin-api';

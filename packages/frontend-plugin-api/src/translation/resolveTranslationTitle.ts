/*
 * Copyright 2026 The Backstage Authors
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

import { ApiHolder, translationApiRef } from '../apis';
import { TranslationRefTuple } from './TranslationRef';

/** @internal */
export function resolveTranslationTitle(
  title: string | TranslationRefTuple,
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string; translation?: TranslationRefTuple };
export function resolveTranslationTitle(
  title: string | TranslationRefTuple | undefined,
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string | undefined; translation?: TranslationRefTuple };
export function resolveTranslationTitle(
  title: string | TranslationRefTuple | undefined,
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string | undefined; translation?: TranslationRefTuple } {
  if (typeof title !== 'object' || title === null) {
    return { title: configuredTitle ?? title };
  }
  const { ref, key } = title;
  const api = apis.get(translationApiRef);
  if (!api) {
    throw new Error(
      'Translation API is required to resolve a translated title',
    );
  }
  const defaultTitle = api.getDefaultMessage(title);
  if (typeof defaultTitle !== 'string') {
    throw new Error(`Unknown title translation key '${key}' in '${ref.id}'`);
  }
  if (defaultTitle.includes('{{') || defaultTitle.includes('$t(')) {
    throw new Error(
      `Title translation '${ref.id}:${key}' must not contain interpolation or nested translations`,
    );
  }
  const fallback = configuredTitle ?? defaultTitle;
  return {
    title: fallback,
    translation: title,
  };
}

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

import { SnapshotSource } from '@backstage/types/alpha';
import { ApiHolder } from '../apis';
import { TranslationRef, toInternalTranslationRef } from './TranslationRef';
import { createTranslationTitleSource } from './createTranslationTitleSource';

/** @internal */
export function resolveTranslationTitle(
  title: string | { ref: TranslationRef; key: string },
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string; source?: SnapshotSource<string> };
export function resolveTranslationTitle(
  title: string | { ref: TranslationRef; key: string } | undefined,
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string | undefined; source?: SnapshotSource<string> };
export function resolveTranslationTitle(
  title: string | { ref: TranslationRef; key: string } | undefined,
  configuredTitle: string | undefined,
  apis: ApiHolder,
): { title: string | undefined; source?: SnapshotSource<string> } {
  if (typeof title !== 'object' || title === null) {
    return { title: configuredTitle ?? title };
  }
  const defaultTitle = toInternalTranslationRef(title.ref).getDefaultMessages()[
    title.key
  ];
  if (typeof defaultTitle !== 'string') {
    throw new Error(
      `Unknown title translation key '${title.key}' in '${title.ref.id}'`,
    );
  }
  if (defaultTitle.includes('{{') || defaultTitle.includes('$t(')) {
    throw new Error(
      `Title translation '${title.ref.id}:${title.key}' must not contain interpolation or nested translations`,
    );
  }
  const fallback = configuredTitle ?? defaultTitle;
  return {
    title: fallback,
    source: createTranslationTitleSource({
      translation: title,
      fallback,
      apis,
    }),
  };
}

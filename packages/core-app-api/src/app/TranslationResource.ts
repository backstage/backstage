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

import { TranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export type TranslationMessages<T> = T extends TranslationRef<infer R>
  ? Partial<R>
  : never;

/** @alpha */
export function createTranslationResource<T extends TranslationRef>(options: {
  ref: T;
  messages?: Record<string, TranslationMessages<T>>;
  lazyMessages: Record<
    string,
    () => Promise<{ messages: TranslationMessages<T> }>
  >;
}) {
  return options;
}

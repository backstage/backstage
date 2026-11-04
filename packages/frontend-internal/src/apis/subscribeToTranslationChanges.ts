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

import type {
  AppLanguageApi,
  TranslationApi,
  TranslationRef,
} from '@backstage/frontend-plugin-api';
import { merge } from 'zen-observable/extras';

/** @internal */
export function subscribeToTranslationChanges(options: {
  translationApi: TranslationApi;
  languageApi: AppLanguageApi;
  refs: readonly TranslationRef[];
  onChange: () => void;
}): () => void {
  const { translationApi, languageApi, onChange } = options;
  const refs = [...new Set(options.refs)];
  if (refs.length === 0) {
    onChange();
    return () => {};
  }
  const subscribe = () =>
    merge(...refs.map(ref => translationApi.translation$(ref))).subscribe({
      next: onChange,
      error: onChange,
    });
  let subscription = subscribe();
  const languageSubscription = languageApi.language$().subscribe(() => {
    if (subscription.closed) {
      subscription = subscribe();
    }
    onChange();
  });
  onChange();
  return () => {
    subscription.unsubscribe();
    languageSubscription.unsubscribe();
  };
}

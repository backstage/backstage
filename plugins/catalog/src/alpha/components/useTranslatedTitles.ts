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

import { useState } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { createTranslatedMessagesSource } from '@internal/frontend';
import {
  translationApiRef,
  useApi,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

/** Resolves title selections without suspending or remounting their consumers. @internal */
export function useTranslatedTitles(
  selections: readonly (TranslationRefTuple<undefined> | undefined)[],
): readonly (string | undefined)[] {
  const api = useApi(translationApiRef);
  const [previousSource, setSource] = useState(() =>
    createTranslatedMessagesSource(api, selections),
  );
  const source = previousSource.matches(api, selections)
    ? previousSource
    : createTranslatedMessagesSource(api, selections);
  if (source !== previousSource) {
    setSource(source);
  }
  return useSyncExternalStore(source.subscribe, source.getSnapshot);
}

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

import { useEffect, useState } from 'react';
import { subscribeToTranslationChanges } from '@internal/frontend';
import {
  appLanguageApiRef,
  translationApiRef,
  useApi,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

/** Resolves title selections without suspending or remounting their consumers. @internal */
export function useTranslatedTitles(
  selections: readonly (TranslationRefTuple | undefined)[],
): readonly (string | undefined)[] {
  const api = useApi(translationApiRef);
  const languageApi = useApi(appLanguageApiRef);
  const read = (previous?: readonly (string | undefined)[]) =>
    selections.map((selection, index) => {
      if (!selection) return undefined;
      const snapshot = api.getTranslation<Record<string, string>>(
        selection.ref,
      );
      return snapshot.ready ? snapshot.t(selection.key) : previous?.[index];
    });
  const [state, setState] = useState(() => ({ selections, values: read() }));
  const values = state.selections === selections ? state.values : read();
  useEffect(() => {
    let active = true;
    const update = () => {
      if (!active) return;
      setState(previous => {
        const next = read(
          previous.selections === selections ? previous.values : undefined,
        );
        return previous.selections === selections &&
          next.every((value, index) => value === previous.values[index])
          ? previous
          : { selections, values: next };
      });
    };
    const unsubscribe = subscribeToTranslationChanges({
      translationApi: api,
      languageApi,
      refs: selections.flatMap(selection => (selection ? [selection.ref] : [])),
      onChange: update,
    });
    return () => {
      active = false;
      unsubscribe();
    };
    // read captures only the API and selections included below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, languageApi, selections]);
  return values;
}

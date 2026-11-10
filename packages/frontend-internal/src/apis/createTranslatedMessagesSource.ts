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
  TranslationApi,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

/** Collects ready translations as a single snapshot, batching notifications within a microtask. @internal */
export function createTranslatedMessagesSource(
  api: TranslationApi,
  selections: readonly (TranslationRefTuple<undefined> | undefined)[],
) {
  const refs = [...new Set(selections.flatMap(s => (s ? [s.ref] : [])))];
  const read = () => {
    const translations = new Map(
      refs.map(ref => [ref, api.getTranslation<Record<string, string>>(ref)]),
    );
    if ([...translations.values()].some(translation => !translation.ready)) {
      return undefined;
    }
    return selections.map(selection =>
      selection ? translations.get(selection.ref)!.t(selection.key) : undefined,
    );
  };
  let snapshot = read();
  let error: Error | undefined;

  return {
    matches(
      nextApi: TranslationApi,
      nextSelections: typeof selections,
    ): boolean {
      return (
        api === nextApi &&
        selections.length === nextSelections.length &&
        selections.every(
          (selection, index) =>
            selection?.ref === nextSelections[index]?.ref &&
            selection?.key === nextSelections[index]?.key,
        )
      );
    },
    getSnapshot: (): readonly (string | undefined)[] | undefined => {
      if (error) throw error;
      return snapshot;
    },
    subscribe(onChange: () => void): () => void {
      let active = true;
      let queued = false;
      const update = () => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          if (!active) return;
          const next = error ? undefined : read();
          if (
            next &&
            (!snapshot ||
              next.some((value, index) => value !== snapshot![index]))
          ) {
            snapshot = next;
          }
          onChange();
        });
      };
      const subscriptions = refs.map(ref =>
        api.translation$(ref).subscribe({
          next: update,
          error: cause => {
            error = cause;
            update();
          },
        }),
      );
      update();
      return () => {
        active = false;
        subscriptions.forEach(subscription => subscription.unsubscribe());
      };
    },
  };
}

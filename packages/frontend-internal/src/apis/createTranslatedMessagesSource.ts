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
  ErrorApi,
  TranslationApi,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

const reportedErrors = new WeakSet<Error>();

/** Collects ready translations as a single snapshot, batching notifications within a microtask. @internal */
export function createTranslatedMessagesSource(options: {
  translationApi: TranslationApi;
  languageApi: AppLanguageApi;
  errorApi: ErrorApi;
  selections: readonly (TranslationRefTuple<undefined> | undefined)[];
}) {
  const { translationApi: api, languageApi, errorApi, selections } = options;
  const refs = [...new Set(selections.flatMap(s => (s ? [s.ref] : [])))];
  const read = (allowFallback = false) => {
    const translations = new Map(
      refs.map(ref => [ref, api.getTranslation<Record<string, string>>(ref)]),
    );
    if (
      !allowFallback &&
      [...translations.values()].some(translation => !translation.ready)
    ) {
      return undefined;
    }
    return selections.map(selection =>
      selection ? translations.get(selection.ref)!.t(selection.key) : undefined,
    );
  };
  let snapshot = read();
  let hasResolved = snapshot !== undefined;
  let failedLanguage: string | undefined;

  return {
    matches(next: typeof options): boolean {
      return (
        api === next.translationApi &&
        languageApi === next.languageApi &&
        errorApi === next.errorApi &&
        selections.length === next.selections.length &&
        selections.every(
          (selection, index) =>
            selection?.ref === next.selections[index]?.ref &&
            selection?.key === next.selections[index]?.key,
        )
      );
    },
    getSnapshot: (): readonly (string | undefined)[] | undefined => snapshot,
    subscribe(onChange: () => void): () => void {
      if (refs.length === 0) {
        return () => {};
      }
      let active = true;
      let queued = false;
      let reconnect = false;
      let language = languageApi.getLanguage().language;
      const update = () => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          if (!active) return;
          const failed = failedLanguage === languageApi.getLanguage().language;
          const next = failed && hasResolved ? undefined : read(failed);
          if (next) {
            if (!failed) hasResolved = true;
            if (
              !snapshot ||
              next.some((value, index) => value !== snapshot![index])
            ) {
              snapshot = next;
            }
          }
          onChange();
        });
      };
      const subscribe = () =>
        refs.map(ref =>
          api.translation$(ref).subscribe({
            next: update,
            error: cause => {
              failedLanguage = languageApi.getLanguage().language;
              reconnect = true;
              if (!reportedErrors.has(cause)) {
                reportedErrors.add(cause);
                errorApi.post(
                  new Error(`Failed to load translations for '${ref.id}'`, {
                    cause,
                  }),
                  { hidden: true },
                );
              }
              update();
            },
          }),
        );
      let subscriptions = subscribe();
      const languageSubscription = languageApi
        .language$()
        .subscribe(({ language: nextLanguage }) => {
          if (nextLanguage === language) return;
          language = nextLanguage;
          if (failedLanguage !== nextLanguage) {
            failedLanguage = undefined;
          }
          if (reconnect) {
            reconnect = false;
            subscriptions.forEach(subscription => subscription.unsubscribe());
            subscriptions = subscribe();
            update();
          }
        });
      update();
      return () => {
        active = false;
        subscriptions.forEach(subscription => subscription.unsubscribe());
        languageSubscription.unsubscribe();
      };
    },
  };
}

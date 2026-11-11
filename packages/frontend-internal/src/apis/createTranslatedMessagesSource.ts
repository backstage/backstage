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
  TranslationRef,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

const reportedErrors = new WeakSet<Error>();

interface RetainedTranslations {
  translationApi: TranslationApi;
  languageApi: AppLanguageApi;
  language: string;
  refs: ReadonlySet<TranslationRef>;
  values: readonly {
    selection: TranslationRefTuple<undefined>;
    value: string;
  }[];
}

/** Collects ready translations as a single snapshot, batching notifications within a microtask. @internal */
export function createTranslatedMessagesSource(
  options: {
    translationApi: TranslationApi;
    languageApi: AppLanguageApi;
    errorApi: ErrorApi;
    selections: readonly (TranslationRefTuple<undefined> | undefined)[];
  },
  previousState?: RetainedTranslations,
) {
  const { translationApi: api, languageApi, errorApi, selections } = options;
  const refs = [...new Set(selections.flatMap(s => (s ? [s.ref] : [])))];
  const retainedState =
    previousState?.translationApi === api &&
    previousState.languageApi === languageApi &&
    previousState.language === languageApi.getLanguage().language
      ? previousState
      : undefined;
  let failure =
    retainedState && refs.some(ref => retainedState.refs.has(ref))
      ? retainedState
      : undefined;
  const read = () => {
    const retained =
      failure?.language === languageApi.getLanguage().language
        ? failure
        : undefined;
    const translations = new Map(
      refs.map(ref => [ref, api.getTranslation<Record<string, string>>(ref)]),
    );
    if (
      !retained &&
      [...translations.values()].some(translation => !translation.ready)
    ) {
      return undefined;
    }
    return selections.map(selection =>
      selection
        ? retained?.values.find(
            value =>
              value.selection.ref === selection.ref &&
              value.selection.key === selection.key,
          )?.value ?? translations.get(selection.ref)!.t(selection.key)
        : undefined,
    );
  };
  let snapshot = read();
  const retainedValues = () =>
    snapshot
      ? selections.flatMap((selection, index) => {
          const value = snapshot![index];
          return selection && value !== undefined ? [{ selection, value }] : [];
        })
      : retainedState?.values ?? [];

  return {
    getRetainedState: (): RetainedTranslations => ({
      translationApi: api,
      languageApi,
      language: languageApi.getLanguage().language,
      refs: failure?.refs ?? new Set(),
      values: failure?.values ?? retainedValues(),
    }),
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
          const next = read();
          if (next) {
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
              const currentLanguage = languageApi.getLanguage().language;
              const previous =
                failure?.language === currentLanguage ? failure : undefined;
              failure = {
                translationApi: api,
                languageApi,
                language: currentLanguage,
                refs: new Set([...(previous?.refs ?? []), ref]),
                values: previous?.values ?? retainedValues(),
              };
              reconnect = true;
              if (
                typeof cause !== 'object' ||
                cause === null ||
                !reportedErrors.has(cause)
              ) {
                if (typeof cause === 'object' && cause !== null) {
                  reportedErrors.add(cause);
                }
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
          if (failure?.language !== nextLanguage) {
            failure = undefined;
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

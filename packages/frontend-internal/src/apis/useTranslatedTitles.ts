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

import { useEffect, useReducer } from 'react';
import type {
  AppLanguageApi,
  ErrorApi,
  TranslationApi,
  TranslationRef,
  TranslationRefTuple,
} from '@backstage/frontend-plugin-api';

const reportedErrors = new WeakSet<Error>();

type Selection = TranslationRefTuple<undefined> | undefined;
type Values = readonly (string | undefined)[];
interface Options {
  translationApi: TranslationApi;
  languageApi: AppLanguageApi;
  errorApi: ErrorApi;
  selections: readonly Selection[];
}
interface Group {
  language: string;
  ready: boolean;
  values: Values;
}
interface State {
  options: Options;
  language: string;
  failed: ReadonlySet<TranslationRef>;
  retained: readonly {
    selection: TranslationRefTuple<undefined>;
    value: string;
  }[];
  values: Values | undefined;
}
type Action =
  | { type: 'inputs' | 'update'; options: Options; group: Group }
  | { type: 'failed'; options: Options; language: string; ref: TranslationRef };

function readGroup({
  translationApi,
  languageApi,
  selections,
}: Options): Group {
  const refs = [...new Set(selections.flatMap(s => (s ? [s.ref] : [])))];
  const translations = new Map(
    refs.map(ref => [
      ref,
      translationApi.getTranslation<Record<string, string>>(ref),
    ]),
  );
  return {
    language: languageApi.getLanguage().language,
    ready: [...translations.values()].every(t => t.ready),
    values: selections.map(s =>
      s ? translations.get(s.ref)!.t(s.key) : undefined,
    ),
  };
}

function reducer(previous: State, action: Action): State {
  let state = previous;
  if (action.type === 'update' && action.options !== state.options) {
    return state;
  }
  // A still-selected ref can fail before the previous effect is replaced.
  if (
    action.type === 'failed' &&
    (action.options.translationApi !== state.options.translationApi ||
      action.options.languageApi !== state.options.languageApi ||
      !state.options.selections.some(
        selection => selection?.ref === action.ref,
      ))
  ) {
    return state;
  }
  const language =
    action.type === 'failed' ? action.language : action.group.language;
  if (action.type === 'inputs') {
    const sameApi =
      state.options.translationApi === action.options.translationApi &&
      state.options.languageApi === action.options.languageApi;
    state = {
      ...state,
      options: action.options,
      failed:
        sameApi && state.language === language
          ? new Set(
              action.options.selections.flatMap(s =>
                s && state.failed.has(s.ref) ? [s.ref] : [],
              ),
            )
          : new Set(),
      retained: sameApi ? state.retained : [],
      values: undefined,
    };
  }
  if (state.language !== language) {
    state = { ...state, language, failed: new Set() };
  }
  if (action.type === 'failed') {
    return { ...state, failed: new Set([...state.failed, action.ref]) };
  }
  if (!action.group.ready && !state.failed.size) {
    return state;
  }
  const values = action.group.values.map((value, index) => {
    const selection = state.options.selections[index];
    return state.failed.size && selection
      ? state.retained.find(
          v =>
            v.selection.ref === selection.ref &&
            v.selection.key === selection.key,
        )?.value ?? value
      : value;
  });
  if (
    action.type === 'update' &&
    state === previous &&
    state.values &&
    values.every((value, index) => value === state.values![index])
  ) {
    return state;
  }
  return {
    ...state,
    values,
    retained: state.failed.size
      ? state.retained
      : state.options.selections.flatMap((selection, index) => {
          const value = values[index];
          return selection && value !== undefined ? [{ selection, value }] : [];
        }),
  };
}

/**
 * Waits for an initial title group, retaining resolved titles during language changes.
 * APIs are supplied by the caller to avoid an inlined-package import cycle.
 * @internal
 */
export function useTranslatedTitles(options: Options): Values | undefined {
  const [state, dispatch] = useReducer(reducer, options, initial => {
    const group = readGroup(initial);
    return reducer(
      {
        options: initial,
        language: group.language,
        failed: new Set(),
        retained: [],
        values: undefined,
      },
      { type: 'inputs', options: initial, group },
    );
  });
  let current = state;
  if (
    state.options.translationApi !== options.translationApi ||
    state.options.languageApi !== options.languageApi ||
    state.options.errorApi !== options.errorApi ||
    state.options.selections.length !== options.selections.length ||
    state.options.selections.some(
      (s, index) =>
        s?.ref !== options.selections[index]?.ref ||
        s?.key !== options.selections[index]?.key,
    )
  ) {
    const action: Action = {
      type: 'inputs',
      options,
      group: readGroup(options),
    };
    current = reducer(state, action);
    dispatch(action);
  }
  const inputs = current.options;
  useEffect(() => {
    const { translationApi, languageApi, errorApi, selections } = inputs;
    const refs = [...new Set(selections.flatMap(s => (s ? [s.ref] : [])))];
    if (!refs.length) {
      return undefined;
    }
    let active = true;
    let queued = false;
    let closed = false;
    let language = languageApi.getLanguage().language;
    const update = () => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        if (active) {
          dispatch({
            type: 'update',
            options: inputs,
            group: readGroup(inputs),
          });
        }
      });
    };
    const subscribe = () =>
      refs.map(ref =>
        translationApi.translation$(ref).subscribe({
          next: update,
          error: cause => {
            if (!active) return;
            closed = true;
            dispatch({
              type: 'failed',
              options: inputs,
              language: languageApi.getLanguage().language,
              ref,
            });
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
        if (closed) {
          closed = false;
          subscriptions.forEach(subscription => subscription.unsubscribe());
          subscriptions = subscribe();
        }
        update();
      });
    update();
    return () => {
      active = false;
      subscriptions.forEach(subscription => subscription.unsubscribe());
      languageSubscription.unsubscribe();
    };
  }, [inputs]);
  return current.values;
}

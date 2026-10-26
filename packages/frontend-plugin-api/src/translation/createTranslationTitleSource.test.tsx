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

import { StrictMode } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { act, renderHook, waitFor } from '@testing-library/react';
import { TestApiRegistry, MockErrorApi } from '@backstage/test-utils';
import { appLanguageApiRef, errorApiRef, translationApiRef } from '../apis';
import { createTranslationRef } from './TranslationRef';
import { createTranslationResource } from './TranslationResource';
import { createTranslationMessages } from './TranslationMessages';
import { createTranslationTitleSource } from './createTranslationTitleSource';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';

it('shares lazy subscriptions, retains titles while loading, and recovers from failed locales', async () => {
  const ref = createTranslationRef({
    id: 'titles',
    messages: { title: 'Default' },
  });
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv', 'de'],
  });
  let resolve!: (value: { default: { title: string } }) => void;
  const pending = new Promise<{ default: { title: string } }>(r => {
    resolve = r;
  });
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationMessages({ ref, messages: { title: 'App English' } }),
      createTranslationResource({
        ref,
        translations: {
          sv: () => pending,
          de: async () => {
            throw new Error('offline');
          },
        },
      }),
    ],
  });
  const observe = jest.spyOn(api, 'translation$');
  const errorApi = new MockErrorApi();
  const post = jest.spyOn(errorApi, 'post').mockImplementation(() => {});
  const source = createTranslationTitleSource({
    translation: { ref, key: 'title' },
    fallback: 'Configured',
    apis: TestApiRegistry.from(
      [translationApiRef, api],
      [appLanguageApiRef, languageApi],
      [errorApiRef, errorApi],
    ),
  });
  expect(source.getSnapshot()).toBe('App English');
  expect(observe).not.toHaveBeenCalled();
  const { result, unmount } = renderHook(() =>
    useSyncExternalStore(source.subscribe, source.getSnapshot),
  );
  const extra = jest.fn();
  const unsubscribe = source.subscribe(extra);
  expect(observe).toHaveBeenCalledTimes(1);
  act(() => languageApi.setLanguage('sv'));
  expect(result.current).toBe('App English');
  const late = renderHook(() =>
    useSyncExternalStore(source.subscribe, source.getSnapshot),
  );
  expect(late.result.current).toBe('App English');
  await act(async () => resolve({ default: { title: 'Svenska' } }));
  await waitFor(() => expect(result.current).toBe('Svenska'));
  expect(late.result.current).toBe('Svenska');
  expect(extra).toHaveBeenCalledTimes(1);
  act(() => languageApi.setLanguage('de'));
  await waitFor(() => expect(post).toHaveBeenCalledTimes(1));
  expect(result.current).toBe('App English');
  act(() => languageApi.setLanguage('sv'));
  await waitFor(() => expect(result.current).toBe('Svenska'));
  unsubscribe();
  unsubscribe();
  late.unmount();
  unmount();
  expect(observe).toHaveBeenCalledTimes(2);
});

it('supports initial loading, fallback-only APIs, Strict Mode, and reconnecting after all consumers leave', async () => {
  const ref = createTranslationRef({
    id: 'initial',
    messages: { title: 'Default' },
  });
  const languageApi = AppLanguageSelector.create({
    defaultLanguage: 'sv',
    availableLanguages: ['en', 'sv'],
  });
  let resolve!: (value: { default: { title: string } }) => void;
  const pending = new Promise<{ default: { title: string } }>(r => {
    resolve = r;
  });
  const loader = jest.fn(() => pending);
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationResource({ ref, translations: { sv: loader } }),
    ],
  });
  const source = createTranslationTitleSource({
    translation: { ref, key: 'title' },
    fallback: 'Default',
    apis: TestApiRegistry.from(
      [translationApiRef, api],
      [appLanguageApiRef, languageApi],
    ),
  });
  expect(source.getSnapshot()).toBe('Default');
  expect(loader).not.toHaveBeenCalled();
  const first = renderHook(
    () => useSyncExternalStore(source.subscribe, source.getSnapshot),
    { wrapper: StrictMode },
  );
  expect(first.result.current).toBe('Default');
  first.unmount();
  await act(async () => resolve({ default: { title: 'Loaded' } }));
  expect(source.getSnapshot()).toBe('Default');
  const next = renderHook(() =>
    useSyncExternalStore(source.subscribe, source.getSnapshot),
  );
  await waitFor(() => expect(next.result.current).toBe('Loaded'));
  act(() => languageApi.setLanguage('en'));
  expect(next.result.current).toBe('Default');
  expect(loader).toHaveBeenCalledTimes(1);
  next.unmount();
  const fallback = createTranslationTitleSource({
    translation: { ref, key: 'title' },
    fallback: 'Configured',
    apis: TestApiRegistry.from(),
  });
  expect(fallback.getSnapshot()).toBe('Configured');
  const cleanup = fallback.subscribe(jest.fn());
  cleanup();
  cleanup();
});

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

import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/frontend-test-utils';
import { translationApiRef } from '../apis';
import { createTranslatedMessagesSource } from '@internal/frontend';
import { createTranslationRef } from './TranslationRef';
import { createTranslationResource } from './TranslationResource';
import { useTranslatedTitles } from './useTranslatedTitles';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';

it('publishes complete title groups, batches notifications, and preserves titles while loading', async () => {
  const ref = createTranslationRef({
    id: 'titles',
    messages: { main: 'Main', other: 'Other' },
  });
  const secondaryRef = createTranslationRef({
    id: 'secondary',
    messages: { title: 'Secondary' },
  });
  const selections = [
    ref('main'),
    undefined,
    ref('other'),
    secondaryRef('title'),
  ];
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv'],
  });
  let resolve!: (value: { default: { main: string; other: string } }) => void;
  const pending = new Promise<{ default: { main: string; other: string } }>(
    r => {
      resolve = r;
    },
  );
  let resolveSecondary!: (value: { default: { title: string } }) => void;
  const secondaryPending = new Promise<{ default: { title: string } }>(r => {
    resolveSecondary = r;
  });
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationResource({ ref, translations: { sv: () => pending } }),
      createTranslationResource({
        ref: secondaryRef,
        translations: { sv: () => secondaryPending },
      }),
    ],
  });
  const observe = jest.spyOn(api, 'translation$');
  const read = jest.spyOn(api, 'getTranslation');
  const renders: Array<readonly (string | undefined)[]> = [];
  const { result, rerender, unmount } = renderHook(
    ({ titles }) => {
      const values = useTranslatedTitles(titles);
      renders.push(values);
      return values;
    },
    {
      initialProps: { titles: selections },
      wrapper: ({ children }: { children: ReactNode }) => (
        <TestApiProvider apis={[[translationApiRef, api]]}>
          {children}
        </TestApiProvider>
      ),
    },
  );
  expect(result.current).toEqual(['Main', undefined, 'Other', 'Secondary']);
  expect(observe).toHaveBeenCalledTimes(2);
  act(() => languageApi.setLanguage('sv'));
  rerender({
    titles: selections.map(selection => selection && { ...selection }),
  });
  expect(observe).toHaveBeenCalledTimes(2);
  expect(result.current).toEqual(['Main', undefined, 'Other', 'Secondary']);
  await act(async () => resolveSecondary({ default: { title: 'Andra' } }));
  expect(api.getTranslation(secondaryRef).ready).toBe(true);
  expect(result.current).toEqual(['Main', undefined, 'Other', 'Secondary']);
  await act(async () => resolve({ default: { main: '', other: 'Annat' } }));
  expect(result.current).toEqual(['', undefined, 'Annat', 'Andra']);
  expect(new Set(renders.map(values => JSON.stringify(values)))).toEqual(
    new Set([
      JSON.stringify(['Main', undefined, 'Other', 'Secondary']),
      JSON.stringify(['', undefined, 'Annat', 'Andra']),
    ]),
  );

  read.mockClear();
  await act(async () => languageApi.setLanguage('en'));
  expect(result.current).toEqual(['Main', undefined, 'Other', 'Secondary']);
  expect(read).toHaveBeenCalledTimes(2);
  expect(observe).toHaveBeenCalledTimes(2);
  rerender({
    titles: [ref('other'), undefined, ref('main'), secondaryRef('title')],
  });
  expect(result.current).toEqual(['Other', undefined, 'Main', 'Secondary']);
  rerender({ titles: [secondaryRef('title'), ref('other')] });
  expect(result.current).toEqual(['Secondary', 'Other']);
  rerender({ titles: [] });
  expect(result.current).toEqual([]);
  unmount();
  const subscriptions = observe.mock.calls.length;
  await act(async () => languageApi.setLanguage('sv'));
  expect(observe).toHaveBeenCalledTimes(subscriptions);
});

it('exposes a failed resource through the grouped snapshot', async () => {
  const ref = createTranslationRef({
    id: 'failed-titles',
    messages: { title: 'Title' },
  });
  const api = I18nextTranslationApi.create({
    languageApi: AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
      defaultLanguage: 'sv',
    }),
    resources: [
      createTranslationResource({
        ref,
        translations: {
          sv: async () => {
            throw new Error('offline');
          },
        },
      }),
    ],
  });
  const source = createTranslatedMessagesSource(api, [ref('title')]);
  expect(source.getSnapshot()).toEqual([undefined]);
  const onChange = jest.fn();
  const unsubscribe = source.subscribe(onChange);
  await waitFor(() => expect(() => source.getSnapshot()).toThrow('offline'));
  expect(onChange).toHaveBeenCalled();
  unsubscribe();
});

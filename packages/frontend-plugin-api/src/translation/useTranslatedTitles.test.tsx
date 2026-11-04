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
import { TestApiProvider } from '@backstage/test-utils';
import { appLanguageApiRef, translationApiRef } from '../apis';
import { createTranslationRef } from './TranslationRef';
import { createTranslationResource } from './TranslationResource';
import { useTranslatedTitles } from './useTranslatedTitles';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';

it('retains resolved titles during loading, handles empty titles, and recovers after a failed locale', async () => {
  const ref = createTranslationRef({
    id: 'titles',
    messages: { main: 'Main', other: 'Other' },
  });
  const selections = [ref('main'), undefined, ref('other')];
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv', 'de'],
  });
  let resolve!: (value: { default: { main: string; other: string } }) => void;
  const pending = new Promise<{ default: { main: string; other: string } }>(
    r => {
      resolve = r;
    },
  );
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
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
  const { result, unmount } = renderHook(
    () => useTranslatedTitles(selections),
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <TestApiProvider
          apis={[
            [translationApiRef, api],
            [appLanguageApiRef, languageApi],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    },
  );
  expect(result.current).toEqual(['Main', undefined, 'Other']);
  expect(observe).toHaveBeenCalledTimes(1);
  act(() => languageApi.setLanguage('sv'));
  expect(result.current).toEqual(['Main', undefined, 'Other']);
  await act(async () => resolve({ default: { main: '', other: 'Annat' } }));
  expect(result.current).toEqual(['', undefined, 'Annat']);
  act(() => languageApi.setLanguage('de'));
  await waitFor(() =>
    expect(result.current).toEqual(['Main', undefined, 'Other']),
  );
  act(() => languageApi.setLanguage('sv'));
  await waitFor(() => expect(result.current).toEqual(['', undefined, 'Annat']));
  unmount();
});

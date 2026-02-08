/*
 * Copyright 2024 The Backstage Authors
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
import { TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef, errorApiRef } from '@backstage/core-plugin-api';
import {
  translationApiRef,
  TranslationApi,
} from '@backstage/core-plugin-api/alpha';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../../core-app-api/src/apis/implementations/AppLanguageApi';
import { createTranslationResource } from '@backstage/core-plugin-api/alpha';
import { useAppTitle } from './useAppTitle';
import { coreComponentsTranslationRef } from '../translation';

function makeWrapper(translationApi: TranslationApi, config: object = {}) {
  return ({ children }: { children: ReactNode }) => (
    <TestApiProvider
      apis={[
        [translationApiRef, translationApi],
        [configApiRef, new ConfigReader(config as any)],
        [errorApiRef, { post: jest.fn(), error$: jest.fn() }],
      ]}
      children={children}
    />
  );
}

describe('useAppTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return translation override when it takes precedence', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: coreComponentsTranslationRef,
          translations: {
            en: () =>
              Promise.resolve({
                default: {
                  'app.title': 'My Translated App',
                } as any,
              }),
          },
        }),
      ],
    });

    const { result } = renderHook(() => useAppTitle(), {
      wrapper: makeWrapper(translationApi, { app: { title: 'Config Title' } }),
    });

    await waitFor(() => {
      expect(result.current).toBe('My Translated App');
    });
  });

  it('should fall back to config value when no translation override', async () => {
    const languageApi = AppLanguageSelector.create();
    // No translation resource override - uses default 'Backstage'
    const translationApi = I18nextTranslationApi.create({ languageApi });

    const { result } = renderHook(() => useAppTitle(), {
      wrapper: makeWrapper(translationApi, { app: { title: 'My Config App' } }),
    });

    await waitFor(() => {
      expect(result.current).toBe('My Config App');
    });
  });

  it('should fall back to default "Backstage" when neither translation nor config is set', async () => {
    const languageApi = AppLanguageSelector.create();
    // No translation resource override - uses default 'Backstage'
    const translationApi = I18nextTranslationApi.create({ languageApi });

    const { result } = renderHook(() => useAppTitle(), {
      wrapper: makeWrapper(translationApi, {}),
    });

    await waitFor(() => {
      expect(result.current).toBe('Backstage');
    });
  });
});

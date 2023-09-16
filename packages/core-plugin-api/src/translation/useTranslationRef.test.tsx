/*
 * Copyright 2023 The Backstage Authors
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

import React, { ReactNode } from 'react';
import { TestApiProvider, withLogCollector } from '@backstage/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { createTranslationRef } from './TranslationRef';
import { useTranslationRef } from './useTranslationRef';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { I18nextTranslationApi } from '../../../core-app-api/src/apis/implementations/TranslationApi';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { AppLanguageSelector } from '../../..//core-app-api/src/apis/implementations/AppLanguageApi';
import {
  createTranslationResource,
  TranslationApi,
  translationApiRef,
} from '../alpha';

const plainRef = createTranslationRef({
  id: 'plain',
  messages: {
    key1: 'default1',
    key2: 'default2',
  },
});

function makeWrapper(translationApi: TranslationApi) {
  return ({ children }: { children: ReactNode }) => (
    <TestApiProvider
      apis={[[translationApiRef, translationApi]]}
      children={children}
    />
  );
}

describe('useTranslationRef', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show default translations', () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({ languageApi });

    const { result } = renderHook(() => useTranslationRef(plainRef), {
      wrapper: makeWrapper(translationApi),
    });

    const { t } = result.current;

    expect(t('key1')).toBe('default1');
    expect(t('key2')).toBe('default2');
  });

  it('should show load translation resource', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            en: () =>
              Promise.resolve({ default: { key1: 'en1', key2: 'en2' } }),
          },
        }),
      ],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useTranslationRef(plainRef),
      {
        wrapper: makeWrapper(translationApi),
      },
    );

    await waitForNextUpdate();

    const { t } = result.current;

    expect(t('key1')).toBe('en1');
    expect(t('key2')).toBe('en2');
  });

  it('should switch between languages', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'de'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            de: () =>
              Promise.resolve({ default: { key1: 'de1', key2: 'de2' } }),
          },
        }),
      ],
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useTranslationRef(plainRef),
      {
        wrapper: makeWrapper(translationApi),
      },
    );

    const { t } = result.current;

    expect(t('key1')).toBe('default1');
    expect(t('key2')).toBe('default2');

    languageApi.setLanguage('de');

    await waitForNextUpdate();

    const { t: t2 } = result.current;

    expect(t2('key1')).toBe('de1');
    expect(t2('key2')).toBe('de2');
  });

  it('should load default resource', async () => {
    const resourceRef = createTranslationRef({
      id: 'resource',
      messages: {
        key1: 'default1',
        key2: 'default2',
      },
      translations: {
        de: () => Promise.resolve({ default: { key1: 'de1', key2: 'de2' } }),
      },
    });

    const languageApi = AppLanguageSelector.create({
      defaultLanguage: 'de',
      availableLanguages: ['en', 'de'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useTranslationRef(resourceRef),
      {
        wrapper: makeWrapper(translationApi),
      },
    );

    await waitForNextUpdate();

    const { t } = result.current;

    expect(t('key1')).toBe('de1');
    expect(t('key2')).toBe('de2');
  });

  it('should log once and then ignore loading errors', async () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: {
        key: 'default',
      },
    });

    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref,
          translations: {
            en: async () => {
              throw new Error('NOPE');
            },
          },
        }),
      ],
    });

    const rendered1 = renderHook(() => useTranslationRef(ref), {
      wrapper: makeWrapper(translationApi),
    });
    const rendered2 = renderHook(() => useTranslationRef(ref), {
      wrapper: makeWrapper(translationApi),
    });

    const { error } = await withLogCollector(['error'], async () => {
      await rendered2.waitForNextUpdate();
    });

    expect(error).toEqual([
      "Failed to load translation resource 'test'; caused by Error: NOPE",
    ]);

    expect(rendered1.result.current.t('key')).toBe('default');
    expect(rendered2.result.current.t('key')).toBe('default');
  });
});

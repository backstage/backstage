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
import {
  MockErrorApi,
  TestApiProvider,
  withLogCollector,
} from '@backstage/test-utils';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { createTranslationRef, TranslationRef } from './TranslationRef';
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
import { ErrorApi, errorApiRef } from '../apis';

const plainRef = createTranslationRef({
  id: 'plain',
  messages: {
    key1: 'default1',
    key2: 'default2',
    component: 'prefix <1>en content</1> suffix',
  },
});

function makeWrapper(
  translationApi: TranslationApi,
  errorApi: ErrorApi = { error$: jest.fn(), post: jest.fn() },
) {
  return ({ children }: { children: ReactNode }) => (
    <TestApiProvider
      apis={[
        [translationApiRef, translationApi],
        [errorApiRef, errorApi],
      ]}
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
              Promise.resolve({
                default: {
                  key1: 'en1',
                  key2: 'en2',
                  component: 'prefix <1>content</1> suffix',
                },
              }),
          },
        }),
      ],
    });

    const { result } = renderHook(() => useTranslationRef(plainRef), {
      wrapper: makeWrapper(translationApi),
    });

    await waitFor(() => {
      const { t } = result.current;
      expect(t('key1')).toBe('en1');
      expect(t('key2')).toBe('en2');
    });
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
              Promise.resolve({
                default: {
                  key1: 'de1',
                  key2: 'de2',
                  component: 'prefix <1>content</1> suffix',
                },
              }),
          },
        }),
      ],
    });

    const { result } = renderHook(() => useTranslationRef(plainRef), {
      wrapper: makeWrapper(translationApi),
    });

    await waitFor(() => {
      const { t } = result.current;

      expect(t('key1')).toBe('default1');
      expect(t('key2')).toBe('default2');
    });

    languageApi.setLanguage('de');

    await waitFor(() => {
      const { t: t2 } = result.current;

      expect(t2('key1')).toBe('de1');
      expect(t2('key2')).toBe('de2');
    });
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

    const { result } = renderHook(() => useTranslationRef(resourceRef), {
      wrapper: makeWrapper(translationApi),
    });

    await waitFor(() => {
      const { t } = result.current;

      expect(t('key1')).toBe('de1');
      expect(t('key2')).toBe('de2');
    });
  });

  it('should log once and then ignore loading errors', async () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: {
        key: 'default',
      },
    });

    const errorApi = new MockErrorApi({ collect: true });
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
      wrapper: makeWrapper(translationApi, errorApi),
    });
    const rendered2 = renderHook(() => useTranslationRef(ref), {
      wrapper: makeWrapper(translationApi, errorApi),
    });

    const { error } = await withLogCollector(['error'], async () => {
      await act(rendered2.rerender);
    });

    const msg =
      "Failed to load translation resource 'test'; caused by Error: NOPE";
    expect(error).toEqual([msg]);
    expect(errorApi.getErrors()).toEqual([
      {
        error: new Error(msg),
      },
    ]);

    expect(rendered1.result.current.t('key')).toBe('default');
    expect(rendered2.result.current.t('key')).toBe('default');
  });

  it('should log once and then ignore loading errors after initial load', async () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: {
        key: 'default',
      },
    });

    const errorApi = new MockErrorApi({ collect: true });
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'de'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref,
          translations: {
            de: async () => {
              throw new Error('NOPE');
            },
          },
        }),
      ],
    });

    const { result } = renderHook(() => useTranslationRef(ref), {
      wrapper: makeWrapper(translationApi, errorApi),
    });

    expect(result.current.t('key')).toBe('default');
    languageApi.setLanguage('de');

    const { error } = await withLogCollector(['error'], async () => {
      const rendered1 = renderHook(() => useTranslationRef(ref), {
        wrapper: makeWrapper(translationApi, errorApi),
      });
      const rendered2 = renderHook(() => useTranslationRef(ref), {
        wrapper: makeWrapper(translationApi, errorApi),
      });

      await new Promise(resolve => setTimeout(resolve)); // Wait a long tick

      expect(rendered1.result.current.t('key')).toBe('default');
      expect(rendered2.result.current.t('key')).toBe('default');
    });

    const msg =
      "Failed to load translation resource 'test'; caused by Error: NOPE";
    expect(error).toEqual([msg]);
    expect(errorApi.getErrors()).toEqual([
      {
        error: new Error(msg),
      },
    ]);
  });

  it('should handle translationRef switches', async () => {
    const ref1 = createTranslationRef({
      id: 'test1',
      messages: {
        key: 'default1',
      },
    });
    const ref2 = createTranslationRef({
      id: 'test2',
      messages: {
        key: 'default2',
      },
    });

    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({ languageApi });

    const { result, rerender } = renderHook(
      ({
        translationRef,
      }: {
        translationRef: TranslationRef;
        children?: ReactNode;
      }) => useTranslationRef(translationRef),
      {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[
              [translationApiRef, translationApi],
              [errorApiRef, { post: jest.fn() }],
            ]}
            children={children}
          />
        ),
        initialProps: { translationRef: ref1 as TranslationRef },
      },
    );

    expect(result.current.t('key')).toBe('default1');
    rerender({ translationRef: ref2 });
    expect(result.current.t('key')).toBe('default2');
  });

  it('should support Translation component', async () => {
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
              Promise.resolve({
                default: {
                  key1: 'de1',
                  key2: 'de2',
                  component: 'prefix <1>de content</1> suffix',
                },
              }),
          },
        }),
      ],
    });

    const { result } = renderHook(() => useTranslationRef(plainRef), {
      wrapper: makeWrapper(translationApi),
    });

    const { Translation } = result.current;

    const { getByTestId, rerender } = render(
      <Translation i18nKey="component">
        prefix <span data-testid="content">default content</span> suffix
      </Translation>,
    );

    expect(getByTestId('content').textContent).toBe('en content');

    languageApi.setLanguage('de');

    await new Promise(resolve => setTimeout(resolve, 100)); // Wait a long tick

    rerender(
      <Translation i18nKey="component">
        prefix <span data-testid="content">default content</span> suffix
      </Translation>,
    );

    expect(getByTestId('content').textContent).toBe('de content');
  });
});

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

import { act, renderHook, waitFor } from '@testing-library/react';
import { mockApis } from '@backstage/frontend-test-utils';
import { createTranslatedMessagesSource } from './createTranslatedMessagesSource';
import {
  createTranslationRef,
  createTranslationResource,
} from '@backstage/frontend-plugin-api';
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
  const errorApi = mockApis.error.mock();
  const observe = jest.spyOn(api, 'translation$');
  const read = jest.spyOn(api, 'getTranslation');
  const renders: Array<readonly (string | undefined)[] | undefined> = [];
  const { result, rerender, unmount } = renderHook(
    ({ titles }) => {
      const values = useTranslatedTitles({
        translationApi: api,
        languageApi,
        errorApi,
        selections: titles,
      });
      renders.push(values);
      return values;
    },
    {
      initialProps: { titles: selections },
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

it('falls back after an initial failure, reports once, and resumes on later language selections', async () => {
  const ref = createTranslationRef({
    id: 'failed-titles',
    messages: { title: 'Title' },
  });
  const otherRef = createTranslationRef({
    id: 'healthy-titles',
    messages: { title: 'Other' },
  });
  let resolveOther!: (value: { default: { title: string } }) => void;
  const other = new Promise<{ default: { title: string } }>(resolve => {
    resolveOther = resolve;
  });
  const failure = new Error('offline');
  const loadSwedish = jest.fn(async () => {
    throw failure;
  });
  let resolveGerman!: (value: { default: { title: string } }) => void;
  const german = new Promise<{ default: { title: string } }>(resolve => {
    resolveGerman = resolve;
  });
  const loadGerman = jest.fn(() => german);
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv', 'de'],
    defaultLanguage: 'sv',
  });
  const errorApi = mockApis.error.mock();
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationResource({
        ref: otherRef,
        translations: { sv: () => other },
      }),
      createTranslationResource({
        ref,
        translations: { sv: loadSwedish, de: loadGerman },
      }),
    ],
  });
  const options = {
    translationApi: api,
    languageApi,
    errorApi,
    selections: [ref('title'), otherRef('title')],
  };
  const source = createTranslatedMessagesSource(options);
  const otherSource = createTranslatedMessagesSource(options);
  expect(source.getSnapshot()).toBeUndefined();
  const onChange = jest.fn();
  const unsubscribe = source.subscribe(onChange);
  const unsubscribeOther = otherSource.subscribe(onChange);
  await waitFor(() => expect(source.getSnapshot()).toEqual(['Title', 'Other']));
  expect(otherSource.getSnapshot()).toEqual(['Title', 'Other']);
  expect(errorApi.post).toHaveBeenCalledTimes(1);
  expect(errorApi.post).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Failed to load translations for 'failed-titles'",
      cause: failure,
    }),
    { hidden: true },
  );
  expect(loadSwedish).toHaveBeenCalledTimes(1);
  resolveOther({ default: { title: 'Andra' } });
  await waitFor(() => expect(source.getSnapshot()).toEqual(['Title', 'Andra']));
  languageApi.setLanguage('de');
  await waitFor(() => expect(loadGerman).toHaveBeenCalledTimes(1));
  expect(source.getSnapshot()).toEqual(['Title', 'Andra']);
  resolveGerman({ default: { title: 'Translated title' } });
  await waitFor(() =>
    expect(source.getSnapshot()).toEqual(['Translated title', 'Other']),
  );
  expect(otherSource.getSnapshot()).toEqual(['Translated title', 'Other']);
  languageApi.setLanguage('sv');
  await waitFor(() => expect(source.getSnapshot()).toEqual(['Title', 'Andra']));
  expect(loadSwedish).toHaveBeenCalledTimes(1);
  expect(errorApi.post).toHaveBeenCalledTimes(1);
  unsubscribe();
  unsubscribeOther();
  onChange.mockClear();
  await act(async () => languageApi.setLanguage('en'));
  expect(onChange).not.toHaveBeenCalled();
});

it('waits for the initial selected-language group without publishing default messages', async () => {
  const ref = createTranslationRef({
    id: 'initial-titles',
    messages: { title: 'English title' },
  });
  const otherRef = createTranslationRef({
    id: 'initial-other',
    messages: { title: 'English other' },
  });
  let resolve!: (value: { default: { title: string } }) => void;
  const pending = new Promise<{ default: { title: string } }>(r => {
    resolve = r;
  });
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv'],
    defaultLanguage: 'sv',
  });
  const errorApi = mockApis.error.mock();
  const api = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationResource({ ref, translations: { sv: () => pending } }),
      createTranslationResource({
        ref: otherRef,
        translations: { sv: async () => ({ default: { title: 'Andra' } }) },
      }),
    ],
  });
  const selections = [ref('title'), undefined, otherRef('title')];
  const published: Array<readonly (string | undefined)[] | undefined> = [];
  const { result } = renderHook(() => {
    const values = useTranslatedTitles({
      translationApi: api,
      languageApi,
      errorApi,
      selections,
    });
    published.push(values);
    return values;
  });
  expect(result.current).toBeUndefined();
  await act(async () => {});
  expect(api.getTranslation(otherRef).ready).toBe(true);
  expect(result.current).toBeUndefined();
  await act(async () => resolve({ default: { title: 'Översikt' } }));
  expect(result.current).toEqual(['Översikt', undefined, 'Andra']);
  expect(
    published.every(value => value === undefined || value[0] === 'Översikt'),
  ).toBe(true);
});

it.each([null, 'offline'])(
  'uses fallback titles after a resource rejects with %p',
  async cause => {
    const ref = createTranslationRef({
      id: 'primitive-rejection',
      messages: { title: 'Fallback title' },
    });
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
      defaultLanguage: 'sv',
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref,
          translations: { sv: () => Promise.reject<never>(cause) },
        }),
      ],
    });
    const errorApi = mockApis.error.mock();
    const { result } = renderHook(() =>
      useTranslatedTitles({
        translationApi,
        languageApi,
        errorApi,
        selections: [ref('title')],
      }),
    );
    await waitFor(() => expect(result.current).toEqual(['Fallback title']));
    expect(errorApi.post).toHaveBeenCalledWith(
      expect.objectContaining({ cause }),
      { hidden: true },
    );
  },
);

it.each(['before', 'after'])(
  'retains titles when selections change %s a failed load',
  async timing => {
    const ref = createTranslationRef({
      id: 'replacement-titles',
      messages: { main: 'Main', other: 'Other', extra: 'Extra' },
    });
    const healthyRef = createTranslationRef({
      id: 'replacement-healthy',
      messages: { title: 'Healthy fallback' },
    });
    let resolveHealthy!: (value: { default: { title: string } }) => void;
    const healthy = new Promise<{ default: { title: string } }>(resolve => {
      resolveHealthy = resolve;
    });
    let rejectGerman!: (cause: Error) => void;
    const german = new Promise<never>((_resolve, reject) => {
      rejectGerman = reject;
    });
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv', 'de'],
      defaultLanguage: 'sv',
    });
    const errorApi = mockApis.error.mock();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref,
          translations: {
            sv: async () => ({
              default: {
                main: 'Huvud',
                other: 'Andra',
                extra: 'Extra svenska',
              },
            }),
            de: () => german,
          },
        }),
        createTranslationResource({
          ref: healthyRef,
          translations: { de: () => healthy },
        }),
      ],
    });
    const { result, rerender } = renderHook(
      ({ selections }) =>
        useTranslatedTitles({
          translationApi,
          languageApi,
          errorApi,
          selections,
        }),
      { initialProps: { selections: [ref('main'), ref('other')] } },
    );
    await waitFor(() => expect(result.current).toEqual(['Huvud', 'Andra']));
    await act(async () => languageApi.setLanguage('de'));
    expect(result.current).toEqual(['Huvud', 'Andra']);
    const nextSelections = [
      ref('other'),
      ref('main'),
      ref('extra'),
      healthyRef('title'),
    ];
    if (timing === 'before') {
      rerender({ selections: nextSelections });
    }
    expect(result.current).toEqual(
      timing === 'before' ? undefined : ['Huvud', 'Andra'],
    );
    await act(async () => rejectGerman(new Error('offline')));
    expect(errorApi.post).toHaveBeenCalledTimes(1);
    if (timing === 'after') {
      rerender({ selections: nextSelections });
    }
    expect(result.current).toEqual([
      'Andra',
      'Huvud',
      'Extra',
      'Healthy fallback',
    ]);
    await act(async () => resolveHealthy({ default: { title: 'Gesund' } }));
    expect(result.current).toEqual(['Andra', 'Huvud', 'Extra', 'Gesund']);
    rerender({ selections: [ref('main'), ref('other')] });
    expect(result.current).toEqual(['Huvud', 'Andra']);
    await act(async () => languageApi.setLanguage('sv'));
    expect(result.current).toEqual(['Huvud', 'Andra']);
    rerender({ selections: [ref('extra'), ref('main')] });
    expect(result.current).toEqual(['Extra svenska', 'Huvud']);
    await act(async () => languageApi.setLanguage('en'));
    expect(result.current).toEqual(['Extra', 'Main']);
  },
);

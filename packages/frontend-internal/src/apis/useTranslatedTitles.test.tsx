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

import {
  StrictMode,
  Suspense,
  startTransition,
  useLayoutEffect,
  useState,
} from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockApis } from '@backstage/frontend-test-utils';
import type { Observable, Observer } from '@backstage/types';
import {
  createTranslationRef,
  createTranslationResource,
  TranslationSnapshot,
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
  const recordRender = jest.fn();
  const first = renderHook(() => {
    recordRender();
    return useTranslatedTitles(options);
  });
  const second = renderHook(() => {
    recordRender();
    return useTranslatedTitles(options);
  });
  expect(first.result.current).toBeUndefined();
  await waitFor(() => expect(first.result.current).toEqual(['Title', 'Other']));
  expect(second.result.current).toEqual(['Title', 'Other']);
  expect(errorApi.post).toHaveBeenCalledTimes(1);
  expect(errorApi.post).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Failed to load translations for 'failed-titles'",
      cause: failure,
    }),
    { hidden: true },
  );
  expect(loadSwedish).toHaveBeenCalledTimes(1);
  await act(async () => resolveOther({ default: { title: 'Andra' } }));
  await waitFor(() => expect(first.result.current).toEqual(['Title', 'Andra']));
  await act(async () => languageApi.setLanguage('de'));
  await waitFor(() => expect(loadGerman).toHaveBeenCalledTimes(1));
  expect(first.result.current).toEqual(['Title', 'Andra']);
  await act(async () =>
    resolveGerman({ default: { title: 'Translated title' } }),
  );
  await waitFor(() =>
    expect(first.result.current).toEqual(['Translated title', 'Other']),
  );
  expect(second.result.current).toEqual(['Translated title', 'Other']);
  await act(async () => languageApi.setLanguage('sv'));
  await waitFor(() => expect(first.result.current).toEqual(['Title', 'Andra']));
  expect(loadSwedish).toHaveBeenCalledTimes(1);
  expect(errorApi.post).toHaveBeenCalledTimes(1);
  first.unmount();
  second.unmount();
  recordRender.mockClear();
  await act(async () => languageApi.setLanguage('en'));
  expect(recordRender).not.toHaveBeenCalled();
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

it('resets on an API replacement and ignores abandoned loads and updates after unmount', async () => {
  const ref = createTranslationRef({
    id: 'api-replacement',
    messages: { title: 'Title' },
  });
  let rejectOld!: (cause: Error) => void;
  const abandoned = new Promise<never>((_resolve, reject) => {
    rejectOld = reject;
  });
  let resolveNew!: (value: { default: { title: string } }) => void;
  const pending = new Promise<{ default: { title: string } }>(resolve => {
    resolveNew = resolve;
  });
  const oldLanguage = AppLanguageSelector.create({
    availableLanguages: ['en', 'de'],
  });
  const newLanguage = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv'],
    defaultLanguage: 'sv',
  });
  const oldApi = I18nextTranslationApi.create({
    languageApi: oldLanguage,
    resources: [
      createTranslationResource({ ref, translations: { de: () => abandoned } }),
    ],
  });
  const newApi = I18nextTranslationApi.create({
    languageApi: newLanguage,
    resources: [
      createTranslationResource({ ref, translations: { sv: () => pending } }),
    ],
  });
  const errorApi = mockApis.error.mock();
  const renders = jest.fn();
  const { result, rerender, unmount } = renderHook(
    ({ translationApi, languageApi }) => {
      renders();
      return useTranslatedTitles({
        translationApi,
        languageApi,
        errorApi,
        selections: [ref('title')],
      });
    },
    {
      initialProps: { translationApi: oldApi, languageApi: oldLanguage },
      wrapper: StrictMode,
    },
  );
  expect(result.current).toEqual(['Title']);
  await act(async () => oldLanguage.setLanguage('de'));
  rerender({ translationApi: newApi, languageApi: newLanguage });
  expect(result.current).toBeUndefined();
  await act(async () => rejectOld(new Error('abandoned')));
  expect(result.current).toBeUndefined();
  expect(errorApi.post).not.toHaveBeenCalled();
  await act(async () => resolveNew({ default: { title: 'New translation' } }));
  expect(result.current).toEqual(['New translation']);
  unmount();
  renders.mockClear();
  await act(async () => newLanguage.setLanguage('en'));
  expect(renders).not.toHaveBeenCalled();
});

it('keeps committed subscriptions active when a selection transition suspends', async () => {
  const ref = createTranslationRef({
    id: 'concurrent-titles',
    messages: { first: 'First', second: 'Second' },
  });
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv'],
  });
  const translationApi = I18nextTranslationApi.create({
    languageApi,
    resources: [
      createTranslationResource({
        ref,
        translations: {
          sv: async () => ({ default: { first: 'Första', second: 'Andra' } }),
        },
      }),
    ],
  });
  const observe = jest.spyOn(translationApi, 'translation$');
  const errorApi = mockApis.error.mock();
  const never = new Promise<void>(() => {});
  function Content() {
    const [pending, setPending] = useState(false);
    const titles = useTranslatedTitles({
      translationApi,
      languageApi,
      errorApi,
      selections: [ref(pending ? 'second' : 'first')],
    });
    if (pending) throw never;
    return (
      <>
        <button onClick={() => startTransition(() => setPending(true))}>
          Change selection
        </button>
        <output>{titles?.[0]}</output>
      </>
    );
  }
  render(
    <Suspense fallback={<div>Suspended</div>}>
      <Content />
    </Suspense>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('First');
  fireEvent.click(screen.getByRole('button', { name: 'Change selection' }));
  expect(screen.queryByText('Suspended')).not.toBeInTheDocument();
  await act(async () => languageApi.setLanguage('sv'));
  expect(screen.getByRole('status')).toHaveTextContent('Första');
  expect(observe).toHaveBeenCalledTimes(1);
  expect(errorApi.post).not.toHaveBeenCalled();
});

it('retains a failure delivered between a selection commit and subscription replacement', async () => {
  type Snapshot = TranslationSnapshot<Record<string, string>>;
  const observers: Observer<Snapshot>[] = [];
  const stream: Observable<Snapshot> = {
    [Symbol.observable]() {
      return this;
    },
    subscribe(observer?: Observer<Snapshot> | ((snapshot: Snapshot) => void)) {
      observers.push(
        typeof observer === 'function' ? { next: observer } : observer ?? {},
      );
      let closed = false;
      return {
        get closed() {
          return closed;
        },
        unsubscribe() {
          closed = true;
        },
      };
    },
  };
  const ref = createTranslationRef({
    id: 'commit-failure',
    messages: { main: 'Main', extra: 'Extra' },
  });
  const languageApi = AppLanguageSelector.create({
    availableLanguages: ['en', 'sv', 'de'],
    defaultLanguage: 'sv',
  });
  const errorApi = mockApis.error.mock();
  const translationApi = mockApis.translation.mock();
  translationApi.translation$.mockReturnValue(stream);
  translationApi.getTranslation.mockReturnValue({
    ready: true,
    t: jest
      .fn()
      .mockImplementation((key: string) =>
        key === 'main' ? 'Huvud' : 'Extra svenska',
      ),
  });
  function Content() {
    const [extra, setExtra] = useState(false);
    const titles = useTranslatedTitles({
      translationApi,
      languageApi,
      errorApi,
      selections: extra ? [ref('extra'), ref('main')] : [ref('main')],
    });
    useLayoutEffect(() => {
      if (extra) {
        translationApi.getTranslation.mockReturnValue({
          ready: true,
          t: jest
            .fn()
            .mockImplementation((key: string) =>
              key === 'main' ? 'Main' : 'Extra',
            ),
        });
        observers[0].error?.(new Error('Failed between render and effect'));
      }
    }, [extra]);
    return (
      <>
        <button onClick={() => setExtra(true)}>Add selection</button>
        <output>{titles?.join(',') ?? 'Loading'}</output>
      </>
    );
  }
  render(<Content />);
  expect(screen.getByRole('status')).toHaveTextContent('Huvud');
  translationApi.getTranslation.mockReturnValue({
    ready: false,
    t: jest
      .fn()
      .mockImplementation((key: string) => (key === 'main' ? 'Main' : 'Extra')),
  });
  await act(async () => languageApi.setLanguage('de'));
  fireEvent.click(screen.getByRole('button', { name: 'Add selection' }));
  await waitFor(() =>
    expect(screen.getByRole('status')).toHaveTextContent('Extra,Huvud'),
  );
  expect(errorApi.post).toHaveBeenCalledTimes(1);
});

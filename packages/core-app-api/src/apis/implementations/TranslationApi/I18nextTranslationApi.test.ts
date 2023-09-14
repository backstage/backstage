/*
 * Copyright 2020 The Backstage Authors
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
  createTranslationMessages,
  createTranslationRef,
  createTranslationResource,
  TranslationSnapshot,
} from '@backstage/core-plugin-api/alpha';
import { Observable } from '@backstage/types';
import { AppLanguageSelector } from '../AppLanguageApi';
import { I18nextTranslationApi } from './I18nextTranslationApi';

const plainRef = createTranslationRef({
  id: 'plain',
  messages: { foo: 'Foo' },
});

const resourceRef = createTranslationRef({
  id: 'resource',
  messages: {
    foo: 'Foo',
    bar: 'Bar',
  },
  translations: {
    sv: () => Promise.resolve({ default: { foo: 'Föö', bar: null } }),
  },
});

function waitForNext<T>(
  observable: Observable<T>,
  predicate?: (result: T) => boolean,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const sub = observable.subscribe({
      next(next) {
        if (!predicate || predicate(next)) {
          resolve(next);
          sub.unsubscribe();
        }
      },
      error(err) {
        reject(err);
        sub.unsubscribe();
      },
      complete() {
        reject(new Error('Observable completed without emitting'));
        sub.unsubscribe();
      },
    });
  });
}

function assertReady<TMessages extends { [key in string]: string }>(
  snapshot: TranslationSnapshot<TMessages>,
) {
  if (!snapshot.ready) {
    throw new Error('snapshot not ready');
  }
  return snapshot;
}

describe('I18nextTranslationApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a translation snapshot', () => {
    const translationApi = I18nextTranslationApi.create({
      languageApi: AppLanguageSelector.create(),
    });

    const snapshot = assertReady(translationApi.getTranslation(plainRef));
    expect(snapshot.t('foo')).toBe('Foo');
  });

  it('should get a translation snapshot for ref with translations', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
    });
    const translationApi = I18nextTranslationApi.create({ languageApi });

    expect(translationApi.getTranslation(resourceRef).ready).toBe(true);
    languageApi.setLanguage('sv');
    await 'a tick';
    expect(translationApi.getTranslation(resourceRef).ready).toBe(false);
  });

  it('should wait for translations to be loaded', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
    });
    const translationApi = I18nextTranslationApi.create({ languageApi });
    expect(translationApi.getTranslation(resourceRef).ready).toBe(true);
    languageApi.setLanguage('sv');
    await 'a tick';
    expect(translationApi.getTranslation(resourceRef).ready).toBe(false);

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Föö');
  });

  it('should create an instance with message overrides', () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationMessages({
          ref: plainRef,
          messages: { foo: 'Bar' },
        }),
      ],
    });
    const snapshot = assertReady(translationApi.getTranslation(plainRef));
    expect(snapshot.t('foo')).toBe('Bar');
  });

  it('should create an instance and ignore null overrides', () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationMessages({
          ref: plainRef,
          messages: { foo: null },
        }),
      ],
    });

    const snapshot = assertReady(translationApi.getTranslation(plainRef));
    expect(snapshot.t('foo')).toBe('Foo');
  });

  it('should create an instance with translation resources', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            sv: () => Promise.resolve({ default: { foo: 'Föö' } }),
          },
        }),
      ],
    });

    languageApi.setLanguage('sv');
    await 'a tick';

    expect(translationApi.getTranslation(plainRef).ready).toBe(false);

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Föö');
  });

  it('should wait for default language translations to be loaded', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            en: () => Promise.resolve({ default: { foo: 'OtherFoo' } }),
          },
        }),
      ],
    });

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(plainRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('OtherFoo');
  });

  it('should allow initial language to not be the default one', async () => {
    const languageApi = AppLanguageSelector.create({
      defaultLanguage: 'sv',
      availableLanguages: ['en', 'sv'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            sv: () => Promise.resolve({ default: { foo: 'Föö' } }),
          },
        }),
      ],
    });

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(plainRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Föö');
  });

  it('should prefer the last loaded resource', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: resourceRef,
          translations: {
            // Duplicate translations fully override previous entries, so the foo value here is ignored
            sv: () => Promise.resolve({ default: { foo: 'Föö', bar: 'Bår' } }),
          },
        }),
        createTranslationResource({
          ref: resourceRef,
          translations: {
            sv: () =>
              Promise.resolve({
                default: createTranslationMessages({
                  ref: resourceRef,
                  messages: { foo: null, bar: 'Bär' },
                }),
              }),
          },
        }),
      ],
    });

    languageApi.setLanguage('sv');

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Foo');
    expect(snapshot.t('bar')).toBe('Bär');
  });

  it('should forward loading errors', async () => {
    const languageApi = AppLanguageSelector.create();
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: { en: () => Promise.reject<never>(new Error('NOPE')) },
        }),
      ],
    });

    await expect(
      waitForNext(translationApi.translation$(plainRef), s => s.ready),
    ).rejects.toThrow('NOPE');
  });

  it('should only call the loader once', async () => {
    const languageApi = AppLanguageSelector.create();
    const loader = jest
      .fn()
      .mockResolvedValue({ default: { foo: 'OtherFoo' } });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: { en: loader },
        }),
      ],
    });

    const observable = translationApi.translation$(plainRef);

    const snapshots = await Promise.all([
      waitForNext(observable, s => s.ready),
      waitForNext(observable, s => s.ready),
      waitForNext(translationApi.translation$(plainRef), s => s.ready),
    ]);
    const [snapshot1, snapshot2, snapshot3] = snapshots.map(assertReady);
    expect(snapshot1.t('foo')).toBe('OtherFoo');
    expect(snapshot2.t('foo')).toBe('OtherFoo');
    expect(snapshot3.t('foo')).toBe('OtherFoo');

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('should handle interrupted loads gracefully', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'sv', 'no'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            en: () => Promise.resolve({ default: { foo: 'foo' } }),
            sv: () => Promise.resolve({ default: { foo: 'Föö' } }),
            no: () => Promise.resolve({ default: { foo: 'Føø' } }),
          },
        }),
      ],
    });

    // Wait for i18n to be initialized first
    const enSnapshot = assertReady(
      await waitForNext(translationApi.translation$(plainRef), s => s.ready),
    );
    expect(enSnapshot.t('foo')).toBe('foo');

    languageApi.setLanguage('sv');
    const nextPromise = waitForNext(translationApi.translation$(plainRef));
    languageApi.setLanguage('no');

    const snapshot = assertReady(await nextPromise);
    expect(snapshot.t('foo')).toBe('Føø');
  });

  it('should only emit changes', async () => {
    const languageApi = AppLanguageSelector.create({
      availableLanguages: ['en', 'dk', 'sv', 'no'],
    });
    const translationApi = I18nextTranslationApi.create({
      languageApi,
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            en: () => Promise.resolve({ default: { foo: 'foo' } }),
            dk: () => Promise.resolve({ default: { foo: 'F🥔🥔' } }),
            sv: () => Promise.resolve({ default: { foo: 'Föö' } }),
            no: () => Promise.resolve({ default: { foo: 'Føø' } }),
          },
        }),
      ],
    });

    const translations = new Array<string | null>();
    await new Promise<void>(resolve => {
      const subscription = translationApi.translation$(plainRef).subscribe({
        next(snapshot) {
          const translation = snapshot.ready ? snapshot.t('foo') : null;
          translations.push(translation);

          if (translation === 'foo') {
            languageApi.setLanguage('dk'); // Not visible
            languageApi.setLanguage('sv');
          } else if (translation === 'Föö') {
            languageApi.setLanguage('no');
          } else if (translation === 'Føø') {
            resolve();
            subscription.unsubscribe();
          }
        },
      });
    });

    expect(translations).toEqual(['foo', null, 'Föö', null, 'Føø']);
  });
});

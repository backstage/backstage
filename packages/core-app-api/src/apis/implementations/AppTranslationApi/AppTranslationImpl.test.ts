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
} from '@backstage/core-plugin-api/alpha';
import { Observable } from '@backstage/types';
import {
  AppTranslationApiImpl,
  TranslationSnapshot,
} from './AppTranslationImpl';

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

describe('AppTranslationApiImpl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a translation snapshot', () => {
    const translationApi = AppTranslationApiImpl.create();
    expect(translationApi.getAvailableLanguages()).toEqual(['en']);

    const snapshot = assertReady(translationApi.getTranslation(plainRef));
    expect(snapshot.t('foo')).toBe('Foo');
  });

  it('should get a translation snapshot for ref with translations', async () => {
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv'],
    });
    expect(translationApi.getAvailableLanguages()).toEqual(['en', 'sv']);

    expect(translationApi.getTranslation(resourceRef).ready).toBe(true);
    await translationApi.changeLanguage('sv');
    expect(translationApi.getTranslation(resourceRef).ready).toBe(false);
  });

  it('should wait for translations to be loaded', async () => {
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv'],
    });
    expect(translationApi.getTranslation(resourceRef).ready).toBe(true);
    await translationApi.changeLanguage('sv');
    expect(translationApi.getTranslation(resourceRef).ready).toBe(false);

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Föö');
  });

  it('should create an instance with message overrides', () => {
    const translationApi = AppTranslationApiImpl.create({
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
    const translationApi = AppTranslationApiImpl.create({
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
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv'],
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            sv: () => Promise.resolve({ default: { foo: 'Föö' } }),
          },
        }),
      ],
    });

    await translationApi.changeLanguage('sv');

    expect(translationApi.getTranslation(plainRef).ready).toBe(false);

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Föö');
  });

  it('should wait for default language translations to be loaded', async () => {
    const translationApi = AppTranslationApiImpl.create({
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

  it('should prefer the last loaded resource', async () => {
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv'],
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

    await translationApi.changeLanguage('sv');

    const snapshot = assertReady(
      await waitForNext(translationApi.translation$(resourceRef), s => s.ready),
    );
    expect(snapshot.t('foo')).toBe('Foo');
    expect(snapshot.t('bar')).toBe('Bär');
  });

  it('should refuse switch on unsupported languages', async () => {
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv'],
    });
    expect(translationApi.getAvailableLanguages()).toEqual(['en', 'sv']);
    await translationApi.changeLanguage('sv');
    await expect(translationApi.changeLanguage('de')).rejects.toThrow(
      "Failed to change language to 'de', available languages are 'en', 'sv",
    );
  });

  it('should forward loading errors', async () => {
    const translationApi = AppTranslationApiImpl.create({
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
    const loader = jest
      .fn()
      .mockResolvedValue({ default: { foo: 'OtherFoo' } });
    const translationApi = AppTranslationApiImpl.create({
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
    const delayedLoader = (msg: string) => () =>
      new Promise<{ default: { foo: string } }>(resolve =>
        setTimeout(() => resolve({ default: { foo: msg } }), 100),
      );
    const translationApi = AppTranslationApiImpl.create({
      supportedLanguages: ['en', 'sv', 'no'],
      resources: [
        createTranslationResource({
          ref: plainRef,
          translations: {
            en: delayedLoader('foo'),
            sv: delayedLoader('Föö'),
            no: delayedLoader('Føø'),
          },
        }),
      ],
    });

    // Wait for i18n to be initialized first
    const enSnapshot = assertReady(
      await waitForNext(translationApi.translation$(plainRef), s => s.ready),
    );
    expect(enSnapshot.t('foo')).toBe('foo');

    translationApi.changeLanguage('sv');
    const nextPromise = waitForNext(translationApi.translation$(plainRef));
    translationApi.changeLanguage('no');

    const snapshot = assertReady(await nextPromise);
    expect(snapshot.t('foo')).toBe('Føø');
  });
});

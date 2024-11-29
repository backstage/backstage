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
          ref: resourceRef,
          messages: { foo: 'Foo Override' },
        }),
      ],
    });
    const snapshot = assertReady(translationApi.getTranslation(resourceRef));
    expect(snapshot.t('foo')).toBe('Foo Override');
    expect(snapshot.t('bar')).toBe('Bar');
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

  it('should forward loading errors and then ignore them', async () => {
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

    const snapshot = assertReady(translationApi.getTranslation(plainRef));
    expect(snapshot.t('foo')).toBe('Foo');
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
          const translation = snapshot.ready
            ? (snapshot.t('foo') as string)
            : null;
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
    expect(translations).toEqual(['foo', 'Föö', 'Føø']);
  });

  describe('formatting', () => {
    function snapshotWithMessages<
      const TMessages extends { [key in string]: string },
    >(messages: TMessages) {
      const translationApi = I18nextTranslationApi.create({
        languageApi: AppLanguageSelector.create(),
      });
      const ref = createTranslationRef({
        id: 'test',
        messages,
      });
      return assertReady(translationApi.getTranslation(ref));
    }

    it('should format plain messages', () => {
      const snapshot = snapshotWithMessages({
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz',
      });

      expect(snapshot.t('foo')).toBe('Foo');
      expect(snapshot.t('bar')).toBe('Bar');
      expect(snapshot.t('baz')).toBe('Baz');
    });

    it('should support interpolation', () => {
      const snapshot = snapshotWithMessages({
        shallow: 'Foo {{ bar }}',
        multiple: 'Foo {{ bar }} {{ baz }}',
        deep: 'Foo {{ bar.baz }}',
      });

      // @ts-expect-error
      expect(snapshot.t('shallow')).toBe('Foo {{ bar }}');
      expect(snapshot.t('shallow', { replace: { bar: 'Bar' } })).toBe(
        'Foo Bar',
      );

      // @ts-expect-error
      expect(snapshot.t('multiple')).toBe('Foo {{ bar }} {{ baz }}');
      // @ts-expect-error
      expect(snapshot.t('multiple', { replace: { bar: 'Bar' } })).toBe(
        'Foo Bar {{ baz }}',
      );
      expect(
        snapshot.t('multiple', { replace: { bar: 'Bar', baz: 'Baz' } }),
      ).toBe('Foo Bar Baz');

      // @ts-expect-error
      expect(snapshot.t('deep')).toBe('Foo {{ bar.baz }}');
      expect(snapshot.t('deep', { replace: { bar: { baz: 'Baz' } } })).toBe(
        'Foo Baz',
      );
    });

    // Escaping isn't as useful in React, since we don't need to escape HTML in strings
    it('should not escape by default', () => {
      const snapshot = snapshotWithMessages({
        foo: 'Foo {{ foo }}',
      });

      expect(snapshot.t('foo', { replace: { foo: '<div>' } })).toBe(
        'Foo <div>',
      );
      expect(
        snapshot.t('foo', {
          replace: { foo: '<div>' },
          interpolation: { escapeValue: true },
        }),
      ).toBe('Foo &lt;div&gt;');
    });

    it('should support nesting', () => {
      const snapshot = snapshotWithMessages({
        foo: 'Foo $t(bar) $t(baz)',
        bar: 'Nested',
        baz: 'Baz {{ qux }}',
      });

      expect(snapshot.t('foo', { qux: 'Deep' })).toBe('Foo Nested Baz Deep');
    });

    it('should support formatting', () => {
      const snapshot = snapshotWithMessages({
        plain: '= {{ x }}',
        number: '= {{ x, number }}',
        numberFixed: '= {{ x, number(minimumFractionDigits: 2) }}',
        relativeTime: '= {{ x, relativeTime }}',
        relativeSeconds: '= {{ x, relativeTime(second) }}',
        relativeSecondsShort:
          '= {{ x, relativeTime(range: second; style: short) }}',
        list: '= {{ x, list }}',
      });

      expect(snapshot.t('plain', { replace: { x: '5' } })).toBe('= 5');
      expect(snapshot.t('number', { replace: { x: 5 } })).toBe('= 5');
      expect(
        snapshot.t('number', {
          replace: { x: 5 },
          formatParams: { x: { minimumFractionDigits: 1 } },
        }),
      ).toBe('= 5.0');
      expect(snapshot.t('numberFixed', { replace: { x: 5 } })).toBe('= 5.00');
      expect(
        snapshot.t('numberFixed', {
          replace: { x: 5 },
          formatParams: { x: { minimumFractionDigits: 3 } },
        }),
      ).toBe('= 5.000');
      expect(snapshot.t('relativeTime', { replace: { x: 3 } })).toBe(
        '= in 3 days',
      );
      expect(snapshot.t('relativeTime', { replace: { x: -3 } })).toBe(
        '= 3 days ago',
      );
      expect(
        snapshot.t('relativeTime', {
          replace: { x: 15 },
          formatParams: { x: { range: 'weeks' } },
        }),
      ).toBe('= in 15 weeks');
      expect(
        snapshot.t('relativeTime', {
          replace: { x: 15 },
          formatParams: { x: { range: 'weeks', style: 'short' } },
        }),
      ).toBe('= in 15 wk.');
      expect(snapshot.t('relativeSeconds', { x: 1 })).toBe('= in 1 second');
      expect(snapshot.t('relativeSeconds', { x: 2 })).toBe('= in 2 seconds');
      expect(snapshot.t('relativeSeconds', { x: -3 })).toBe('= 3 seconds ago');
      expect(snapshot.t('relativeSeconds', { x: 0 })).toBe('= in 0 seconds');
      expect(snapshot.t('relativeSecondsShort', { x: 1 })).toBe('= in 1 sec.');
      expect(snapshot.t('relativeSecondsShort', { x: 2 })).toBe('= in 2 sec.');
      expect(snapshot.t('relativeSecondsShort', { x: -3 })).toBe(
        '= 3 sec. ago',
      );
      expect(snapshot.t('relativeSecondsShort', { x: 0 })).toBe('= in 0 sec.');
      expect(snapshot.t('list', { x: ['a'] })).toBe('= a');
      expect(snapshot.t('list', { x: ['a', 'b'] })).toBe('= a and b');
      expect(snapshot.t('list', { x: ['a', 'b', 'c'] })).toBe('= a, b, and c');
    });

    it('should support plurals', () => {
      const snapshot = snapshotWithMessages({
        derp_one: 'derp',
        derp_other: 'derps',
        derpWithCount_one: '{{ count }} derp',
        derpWithCount_other: '{{ count }} derps',
      });

      expect(snapshot.t('derp', { count: 1 })).toBe('derp');
      expect(snapshot.t('derp', { count: 2 })).toBe('derps');
      expect(snapshot.t('derp', { count: 0 })).toBe('derps');
      expect(snapshot.t('derpWithCount', { count: 1 })).toBe('1 derp');
      expect(snapshot.t('derpWithCount', { count: 2 })).toBe('2 derps');
      expect(snapshot.t('derpWithCount', { count: 0 })).toBe('0 derps');
    });
  });
});

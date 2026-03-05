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

import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import { mockApis } from './mockApis';
import { JsonValue } from '@backstage/types';
import { StorageValueSnapshot } from '@backstage/core-plugin-api';
import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

describe('mockApis', () => {
  describe('analytics', () => {
    it('can create an instance', () => {
      const analytics = mockApis.analytics();
      expect(
        analytics.captureEvent({
          action: 'a',
          subject: 'b',
          context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
        }),
      ).toBeUndefined();
    });

    it('can create a mock and make assertions on it', async () => {
      expect.assertions(3);
      const analytics = mockApis.analytics.mock({
        captureEvent: event => {
          expect(event).toEqual({
            action: 'a',
            subject: 'b',
            context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
          });
        },
      });
      expect(
        analytics.captureEvent({
          action: 'a',
          subject: 'b',
          context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
        }),
      ).toBeUndefined();
      expect(analytics.captureEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('config', () => {
    const data = { backend: { baseUrl: 'http://test.com' } };

    it('can create an instance', () => {
      const empty = mockApis.config();
      expect(empty.getOptional('backend.baseUrl')).toBeUndefined();

      const notEmpty = mockApis.config({ data });
      expect(notEmpty.getOptional('backend.baseUrl')).toEqual(
        'http://test.com',
      );
    });

    it('can create a mock and make assertions on it', async () => {
      const mock = mockApis.config.mock({ getString: () => 'replaced' });
      expect(mock.getString('a')).toEqual('replaced');
      expect(mock.getString).toHaveBeenCalledTimes(1);
    });
  });

  describe('discovery', () => {
    it('can create an instance', async () => {
      const empty = mockApis.discovery();
      await expect(empty.getBaseUrl('catalog')).resolves.toBe(
        'http://example.com/api/catalog',
      );

      const notEmpty = mockApis.discovery({ baseUrl: 'https://other.net' });
      await expect(notEmpty.getBaseUrl('catalog')).resolves.toBe(
        'https://other.net/api/catalog',
      );
    });

    it('can create a mock and make assertions on it', async () => {
      const empty = mockApis.discovery.mock();
      expect(empty.getBaseUrl('catalog')).toBeUndefined();
      expect(empty.getBaseUrl).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.discovery.mock({
        getBaseUrl: async () => 'replaced',
      });
      await expect(notEmpty.getBaseUrl('catalog')).resolves.toBe('replaced');
      expect(notEmpty.getBaseUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('identity', () => {
    it('can create an instance', async () => {
      const empty = mockApis.identity();
      await expect(empty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'user:default/test',
        ownershipEntityRefs: ['user:default/test'],
      });
      await expect(empty.getCredentials()).resolves.toEqual({});
      await expect(empty.getProfileInfo()).resolves.toEqual({});
      await expect(empty.signOut()).resolves.toBeUndefined();

      const notEmpty = mockApis.identity({
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
        token: 'c',
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
      });
      await expect(notEmpty.getCredentials()).resolves.toEqual({ token: 'c' });
      await expect(notEmpty.getProfileInfo()).resolves.toEqual({
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.signOut()).resolves.toBeUndefined();
    });

    it('can create a mock and make assertions on it', async () => {
      const empty = mockApis.identity.mock();
      expect(empty.getBackstageIdentity()).toBeUndefined();
      expect(empty.getCredentials()).toBeUndefined();
      expect(empty.getProfileInfo()).toBeUndefined();
      expect(empty.signOut()).toBeUndefined();
      expect(empty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(empty.getCredentials).toHaveBeenCalledTimes(1);
      expect(empty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(empty.signOut).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.identity.mock({
        getBackstageIdentity: async () => ({
          type: 'user',
          userEntityRef: 'a',
          ownershipEntityRefs: ['b'],
        }),
        getCredentials: async () => ({ token: 'c' }),
        getProfileInfo: async () => ({
          email: 'd',
          displayName: 'e',
          picture: 'f',
        }),
        signOut: async () => undefined,
      });
      await expect(notEmpty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
      });
      await expect(notEmpty.getCredentials()).resolves.toEqual({ token: 'c' });
      await expect(notEmpty.getProfileInfo()).resolves.toEqual({
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.signOut()).resolves.toBeUndefined();
      expect(notEmpty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(notEmpty.getCredentials).toHaveBeenCalledTimes(1);
      expect(notEmpty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(notEmpty.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('permission', () => {
    it('can create an instance', async () => {
      // default allow
      const permission1 = mockApis.permission();
      await expect(
        permission1.authorize({
          permission: createPermission({
            name: 'permission.1',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.ALLOW });

      // static value
      const permission2 = mockApis.permission({
        authorize: AuthorizeResult.DENY,
      });
      await expect(
        permission2.authorize({
          permission: createPermission({
            name: 'permission.1',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.DENY });

      // callback form
      const permission3 = mockApis.permission({
        authorize: req =>
          req.permission.name === 'permission.1'
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
      });
      await expect(
        permission3.authorize({
          permission: createPermission({
            name: 'permission.1',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.ALLOW });
      await expect(
        permission3.authorize({
          permission: createPermission({
            name: 'permission.2',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.DENY });
    });

    it('can create a mock and make assertions on it', async () => {
      const empty = mockApis.permission.mock();
      expect(
        empty.authorize({
          permission: createPermission({
            name: 'permission.1',
            attributes: {},
          }),
        }),
      ).toBeUndefined();
      expect(empty.authorize).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.permission.mock({
        authorize: async req => ({
          result:
            req.permission.name === 'permission.1'
              ? AuthorizeResult.ALLOW
              : AuthorizeResult.DENY,
        }),
      });
      await expect(
        notEmpty.authorize({
          permission: createPermission({
            name: 'permission.1',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.ALLOW });
      await expect(
        notEmpty.authorize({
          permission: createPermission({
            name: 'permission.2',
            attributes: {},
          }),
        }),
      ).resolves.toEqual({ result: AuthorizeResult.DENY });
      expect(notEmpty.authorize).toHaveBeenCalledTimes(2);
    });
  });

  describe('storage', () => {
    describe('instance deep tests', () => {
      it('should return undefined for values which are unset', async () => {
        const storage = mockApis.storage();

        expect(storage.snapshot('myfakekey').value).toBeUndefined();
        expect(storage.snapshot('myfakekey')).toEqual({
          key: 'myfakekey',
          presence: 'absent',
          value: undefined,
          newValue: undefined,
        });
      });

      it('should allow the setting and snapshotting of the simple data structures', async () => {
        const storage = mockApis.storage();

        await storage.set('myfakekey', 'helloimastring');
        await storage.set('mysecondfakekey', 1234);
        await storage.set('mythirdfakekey', true);
        expect(storage.snapshot('myfakekey').value).toBe('helloimastring');
        expect(storage.snapshot('mysecondfakekey').value).toBe(1234);
        expect(storage.snapshot('mythirdfakekey').value).toBe(true);
        expect(storage.snapshot('myfakekey')).toEqual({
          key: 'myfakekey',
          presence: 'present',
          value: 'helloimastring',
        });
        expect(storage.snapshot('mysecondfakekey')).toEqual({
          key: 'mysecondfakekey',
          presence: 'present',
          value: 1234,
        });
        expect(storage.snapshot('mythirdfakekey')).toEqual({
          key: 'mythirdfakekey',
          presence: 'present',
          value: true,
        });
      });

      it('should allow setting of complex datastructures', async () => {
        const storage = mockApis.storage();

        const mockData = {
          something: 'here',
          is: [{ super: { complex: [{ but: 'something', why: true }] } }],
        };

        await storage.set('myfakekey', mockData);

        expect(storage.snapshot('myfakekey').value).toEqual(mockData);
        expect(storage.snapshot('myfakekey')).toEqual({
          key: 'myfakekey',
          presence: 'present',
          value: mockData,
        });
      });

      it('should subscribe to key changes when setting a new value', async () => {
        const storage = mockApis.storage();

        const wrongKeyNextHandler = jest.fn();
        const selectedKeyNextHandler = jest.fn();
        const mockData = { hello: 'im a great new value' };

        await new Promise<void>(resolve => {
          storage.observe$<typeof mockData>('correctKey').subscribe({
            next: (...args) => {
              selectedKeyNextHandler(...args);
              resolve();
            },
          });

          storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

          storage.set('correctKey', mockData);
        });

        expect(wrongKeyNextHandler).not.toHaveBeenCalled();
        expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
        expect(selectedKeyNextHandler).toHaveBeenCalledWith({
          key: 'correctKey',
          presence: 'present',
          value: mockData,
        });
      });

      it('should subscribe to key changes when deleting a value', async () => {
        const storage = mockApis.storage();

        const wrongKeyNextHandler = jest.fn();
        const selectedKeyNextHandler = jest.fn();
        const mockData = { hello: 'im a great new value' };

        storage.set('correctKey', mockData);

        await new Promise<void>(resolve => {
          storage.observe$('correctKey').subscribe({
            next: (...args) => {
              selectedKeyNextHandler(...args);
              resolve();
            },
          });

          storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

          storage.remove('correctKey');
        });

        expect(wrongKeyNextHandler).not.toHaveBeenCalled();
        expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
        expect(selectedKeyNextHandler).toHaveBeenCalledWith({
          key: 'correctKey',
          presence: 'absent',
          value: undefined,
          newValue: undefined,
        });
      });

      it('should be able to create different buckets for different uses', async () => {
        const rootStorage = mockApis.storage();

        const firstStorage = rootStorage.forBucket('userSettings');
        const secondStorage = rootStorage.forBucket('profileSettings');
        const keyName = 'blobby';

        await firstStorage.set(keyName, 'boop');
        await secondStorage.set(keyName, 'deerp');

        expect(firstStorage.snapshot(keyName)).not.toBe(
          secondStorage.snapshot(keyName),
        );
        expect(firstStorage.snapshot(keyName).value).toBe('boop');
        expect(secondStorage.snapshot(keyName).value).toBe('deerp');
        expect(firstStorage.snapshot(keyName)).not.toEqual(
          secondStorage.snapshot(keyName),
        );
        expect(firstStorage.snapshot(keyName)).toEqual({
          key: keyName,
          presence: 'present',
          value: 'boop',
        });
        expect(secondStorage.snapshot(keyName)).toEqual({
          key: keyName,
          presence: 'present',
          value: 'deerp',
        });
      });

      it('should not clash with other namespaces when creating buckets', async () => {
        const rootStorage = mockApis.storage();

        // when getting key test2 it will translate to /profile/something/deep/test2
        const firstStorage = rootStorage
          .forBucket('profile')
          .forBucket('something')
          .forBucket('deep');
        // when getting key deep/test2 it will translate to /profile/something/deep/test2
        const secondStorage = rootStorage.forBucket('profile/something');

        await firstStorage.set('test2', { error: true });

        expect(secondStorage.snapshot('deep/test2').value).toBe(undefined);
        expect(secondStorage.snapshot('deep/test2')).toMatchObject({
          presence: 'absent',
        });
      });

      it('should not reuse storage instances between different rootStorages', async () => {
        const rootStorage1 = mockApis.storage();
        const rootStorage2 = mockApis.storage();

        const firstStorage = rootStorage1.forBucket('something');
        const secondStorage = rootStorage2.forBucket('something');

        await firstStorage.set('test2', true);

        expect(firstStorage.snapshot('test2').value).toBe(true);
        expect(secondStorage.snapshot('test2').value).toBe(undefined);
        expect(firstStorage.snapshot('test2')).toEqual({
          key: 'test2',
          presence: 'present',
          value: true,
        });
        expect(secondStorage.snapshot('test2')).toEqual({
          key: 'test2',
          presence: 'absent',
          value: undefined,
        });
      });

      it('should freeze the snapshot value', async () => {
        const storage = mockApis.storage();

        const data = { foo: 'bar', baz: [{ foo: 'bar' }] };
        storage.set('foo', data);

        const snapshot = storage.snapshot<typeof data>('foo');
        expect(snapshot.value).not.toBe(data);

        if (snapshot.presence !== 'present') {
          throw new Error('Invalid presence');
        }

        expect(() => {
          snapshot.value.foo = 'buzz';
        }).toThrow(/Cannot assign to read only property/);
        expect(() => {
          snapshot.value.baz[0].foo = 'buzz';
        }).toThrow(/Cannot assign to read only property/);
        expect(() => {
          snapshot.value.baz.push({ foo: 'buzz' });
        }).toThrow(/Cannot add property 1, object is not extensible/);
      });

      it('should freeze observed values', async () => {
        const storage = mockApis.storage();

        const snapshotPromise = new Promise<any>(resolve => {
          storage.observe$('test').subscribe({
            next: resolve,
          });
        });

        storage.set('test', {
          foo: {
            bar: 'baz',
          },
        });

        const snapshot = await snapshotPromise;
        expect(snapshot.presence).toBe('present');
        expect(() => {
          snapshot.value!.foo.bar = 'qux';
        }).toThrow(/Cannot assign to read only property 'bar' of object/);
      });

      it('should JSON serialize stored values', async () => {
        const storage = mockApis.storage();

        storage.set<any>('test', {
          foo: {
            toJSON() {
              return {
                bar: 'baz',
              };
            },
          },
        });

        expect(storage.snapshot('test')).toMatchObject({
          presence: 'present',
          value: {
            foo: {
              bar: 'baz',
            },
          },
        });
      });
    });

    it('can create an instance', () => {
      const empty = mockApis.storage();
      expect(empty.snapshot('a')).toEqual({ key: 'a', presence: 'absent' });

      const notEmpty = mockApis.storage({ data: { a: 1, b: { c: 2 } } });
      expect(notEmpty.snapshot('a')).toEqual({
        key: 'a',
        presence: 'present',
        value: 1,
      });
      expect(notEmpty.forBucket('b').snapshot('c')).toEqual({
        key: 'c',
        presence: 'present',
        value: 2,
      });
    });

    it('can create a mock and make assertions on it', () => {
      const empty = mockApis.storage.mock();
      expect(empty.snapshot('a')).toBeUndefined();
      expect(empty.snapshot).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.storage.mock({
        snapshot<T extends JsonValue>(k: string): StorageValueSnapshot<T> {
          return { key: k, presence: 'present', value: 'v' as T };
        },
      });
      expect(notEmpty.snapshot('a')).toEqual({
        key: 'a',
        presence: 'present',
        value: 'v',
      });
      expect(notEmpty.snapshot).toHaveBeenCalledTimes(1);
    });
  });

  describe('translation', () => {
    describe('instance deep tests', () => {
      function snapshotWithMessages<
        const TMessages extends { [key in string]: string },
      >(messages: TMessages) {
        const translationApi = mockApis.translation();
        const ref = createTranslationRef({
          id: 'test',
          messages,
        });
        const snapshot = translationApi.getTranslation(ref);
        if (!snapshot.ready) {
          throw new Error('Translation snapshot is not ready');
        }
        return snapshot;
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
        expect(snapshot.t('shallow', { bar: 'Bar' })).toBe('Foo Bar');

        // @ts-expect-error
        expect(snapshot.t('multiple')).toBe('Foo {{ bar }} {{ baz }}');
        // @ts-expect-error
        expect(snapshot.t('multiple', { bar: 'Bar' })).toBe(
          'Foo Bar {{ baz }}',
        );
        expect(snapshot.t('multiple', { bar: 'Bar', baz: 'Baz' })).toBe(
          'Foo Bar Baz',
        );

        // @ts-expect-error
        expect(snapshot.t('deep')).toBe('Foo {{ bar.baz }}');
        expect(snapshot.t('deep', { bar: { baz: 'Baz' } })).toBe('Foo Baz');
      });

      // Escaping isn't as useful in React, since we don't need to escape HTML in strings
      it('should not escape by default', () => {
        const snapshot = snapshotWithMessages({
          foo: 'Foo {{ foo }}',
        });

        expect(snapshot.t('foo', { foo: '<div>' })).toBe('Foo <div>');
        expect(
          snapshot.t('foo', {
            foo: '<div>',
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

        expect(snapshot.t('plain', { x: '5' })).toBe('= 5');
        expect(snapshot.t('number', { x: 5 })).toBe('= 5');
        expect(
          snapshot.t('number', {
            x: 5,
            formatParams: { x: { minimumFractionDigits: 1 } },
          }),
        ).toBe('= 5.0');
        expect(snapshot.t('numberFixed', { x: 5 })).toBe('= 5.00');
        expect(
          snapshot.t('numberFixed', {
            x: 5,
            formatParams: { x: { minimumFractionDigits: 3 } },
          }),
        ).toBe('= 5.000');
        expect(snapshot.t('relativeTime', { x: 3 })).toBe('= in 3 days');
        expect(snapshot.t('relativeTime', { x: -3 })).toBe('= 3 days ago');
        expect(
          snapshot.t('relativeTime', {
            x: 15,
            formatParams: { x: { range: 'weeks' } },
          }),
        ).toBe('= in 15 weeks');
        expect(
          snapshot.t('relativeTime', {
            x: 15,
            formatParams: { x: { range: 'weeks', style: 'short' } },
          }),
        ).toBe('= in 15 wk.');
        expect(snapshot.t('relativeSeconds', { x: 1 })).toBe('= in 1 second');
        expect(snapshot.t('relativeSeconds', { x: 2 })).toBe('= in 2 seconds');
        expect(snapshot.t('relativeSeconds', { x: -3 })).toBe(
          '= 3 seconds ago',
        );
        expect(snapshot.t('relativeSeconds', { x: 0 })).toBe('= in 0 seconds');
        expect(snapshot.t('relativeSecondsShort', { x: 1 })).toBe(
          '= in 1 sec.',
        );
        expect(snapshot.t('relativeSecondsShort', { x: 2 })).toBe(
          '= in 2 sec.',
        );
        expect(snapshot.t('relativeSecondsShort', { x: -3 })).toBe(
          '= 3 sec. ago',
        );
        expect(snapshot.t('relativeSecondsShort', { x: 0 })).toBe(
          '= in 0 sec.',
        );
        expect(snapshot.t('list', { x: ['a'] })).toBe('= a');
        expect(snapshot.t('list', { x: ['a', 'b'] })).toBe('= a and b');
        expect(snapshot.t('list', { x: ['a', 'b', 'c'] })).toBe(
          '= a, b, and c',
        );
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

    it('can create an instance', () => {
      const translation = mockApis.translation();
      const ref = createTranslationRef({
        id: 'test',
        messages: { a: 'b' },
      });
      const result = translation.getTranslation(ref);
      if (!result.ready) {
        throw new Error('not ready');
      }
      expect(result.t('a')).toEqual('b');
    });

    it('can create a mock and make assertions on it', () => {
      const ref = createTranslationRef({
        id: 'test',
        messages: { a: 'b' },
      });

      const empty = mockApis.translation.mock();
      expect(empty.getTranslation(ref)).toBeUndefined();

      const notEmpty = mockApis.translation.mock({
        getTranslation: () =>
          ({
            ready: true,
            t: () => 'b',
          } as any),
      });
      const result = notEmpty.getTranslation(ref);
      if (!result.ready) {
        throw new Error('not ready');
      }
      expect(result.t('a')).toEqual('b');
      expect(notEmpty.getTranslation).toHaveBeenCalledTimes(1);
    });
  });
});

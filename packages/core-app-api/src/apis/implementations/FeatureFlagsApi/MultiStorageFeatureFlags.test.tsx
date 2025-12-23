/*
 * Copyright 2025 The Backstage Authors
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

import { MockErrorApi } from '@backstage/test-utils';
import { WebStorage } from '../StorageApi';
import { MultiStorageFeatureFlags } from './MultiStorageFeatureFlags';
import { FeatureFlagState, FeatureFlagsApi } from '@backstage/core-plugin-api';

describe('MultiStorageFeatureFlags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('getFlags', () => {
    let errorApi: MockErrorApi;
    let featureFlags: FeatureFlagsApi;

    beforeEach(() => {
      window.localStorage.clear();
      errorApi = new MockErrorApi();
      featureFlags = new MultiStorageFeatureFlags({
        storageApi: WebStorage.create({ errorApi }),
      });
    });

    it('returns no flags', () => {
      expect(featureFlags.getRegisteredFlags()).toEqual([]);
    });

    it('loads flags from local storage', async () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
          'feature-flag-four': 2,
          'feature-flag-five': 'not-valid',
        }),
      );

      expect(featureFlags.isActive('feature-flag-one')).toBe(true);
      expect(featureFlags.isActive('feature-flag-two')).toBe(true);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);
      expect(featureFlags.isActive('feature-flag-four')).toBe(false);
      expect(featureFlags.isActive('feature-flag-five')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-one')).toBe(true);
      expect(await featureFlags.getFlag('feature-flag-two')).toBe(true);
      expect(await featureFlags.getFlag('feature-flag-three')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-four')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-five')).toBe(false);
    });

    it('loads flags from local storage and storage api', async () => {
      featureFlags.registerFlag({
        name: 'persisted-flag-one',
        persisted: true,
        pluginId: '-',
      });
      featureFlags.registerFlag({
        name: 'persisted-flag-two',
        persisted: true,
        pluginId: '-',
      });
      featureFlags.registerFlag({
        name: 'persisted-flag-three',
        persisted: true,
        pluginId: '-',
      });
      featureFlags.registerFlag({
        name: 'persisted-flag-four',
        persisted: true,
        pluginId: '-',
      });
      featureFlags.registerFlag({
        name: 'persisted-flag-five',
        persisted: true,
        pluginId: '-',
      });

      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
          'feature-flag-four': 2,
          'feature-flag-five': 'not-valid',
        }),
      );

      window.localStorage.setItem('/feature-flags/persisted-flag-one', '1');
      window.localStorage.setItem('/feature-flags/persisted-flag-two', '1');
      window.localStorage.setItem('/feature-flags/persisted-flag-three', '0');
      window.localStorage.setItem('/feature-flags/persisted-flag-four', '2');
      window.localStorage.setItem(
        '/feature-flags/persisted-flag-five',
        '"not-valid"',
      );

      expect(featureFlags.isActive('feature-flag-one')).toBe(true);
      expect(featureFlags.isActive('feature-flag-two')).toBe(true);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);
      expect(featureFlags.isActive('feature-flag-four')).toBe(false);
      expect(featureFlags.isActive('feature-flag-five')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-one')).toBe(true);
      expect(await featureFlags.getFlag('feature-flag-two')).toBe(true);
      expect(await featureFlags.getFlag('feature-flag-three')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-four')).toBe(false);
      expect(await featureFlags.getFlag('feature-flag-five')).toBe(false);

      expect(await featureFlags.getFlag('persisted-flag-one')).toBe(true);
      expect(await featureFlags.getFlag('persisted-flag-two')).toBe(true);
      expect(await featureFlags.getFlag('persisted-flag-three')).toBe(false);
      expect(await featureFlags.getFlag('persisted-flag-four')).toBe(false);
      expect(await featureFlags.getFlag('persisted-flag-five')).toBe(false);
      expect(featureFlags.isActive('persisted-flag-one')).toBe(true);
      expect(featureFlags.isActive('persisted-flag-two')).toBe(true);
      expect(featureFlags.isActive('persisted-flag-three')).toBe(false);
      expect(featureFlags.isActive('persisted-flag-four')).toBe(false);
      expect(featureFlags.isActive('persisted-flag-five')).toBe(false);
    });

    it('sets the correct values', async () => {
      featureFlags.registerFlag({
        name: 'persisted-flag-zero',
        persisted: true,
        pluginId: '-',
      });

      const persistedValues: boolean[] = [];
      const subscription = featureFlags
        .observe$('persisted-flag-zero')
        .subscribe(value => {
          if (persistedValues.at(-1) !== value) {
            persistedValues.push(value);
          }
        });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(persistedValues).toEqual([false]);

      featureFlags.save({
        states: {
          'feature-flag-zero': FeatureFlagState.Active,
          'persisted-flag-zero': FeatureFlagState.Active,
        },
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(featureFlags.isActive('feature-flag-zero')).toBe(true);
      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-zero":1}',
      );
      expect(featureFlags.isActive('persisted-flag-zero')).toBe(true);
      expect(await featureFlags.getFlag('persisted-flag-zero')).toBe(true);

      expect(persistedValues).toEqual([false, true]);

      subscription.unsubscribe();
    });

    it('deletes the correct values', async () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 0,
          'feature-flag-tree': 1,
          'feature-flag-four': 0,
        }),
      );

      featureFlags.save({
        states: {
          'feature-flag-one': FeatureFlagState.None,
          'feature-flag-two': FeatureFlagState.Active,
        },
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-two":1}',
      );
    });

    it('clears all values', async () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
        }),
      );

      expect(featureFlags.isActive('feature-flag-one')).toBe(true);
      expect(featureFlags.isActive('feature-flag-two')).toBe(true);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);

      featureFlags.save({ states: {} });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(featureFlags.isActive('feature-flag-one')).toBe(false);
      expect(featureFlags.isActive('feature-flag-two')).toBe(false);
      expect(featureFlags.isActive('feature-flag-three')).toBe(false);

      expect(window.localStorage.getItem('featureFlags')).toEqual('{}');
    });
  });

  describe('getRegisteredFlags', () => {
    let errorApi: MockErrorApi;
    let featureFlags: FeatureFlagsApi;

    beforeEach(() => {
      errorApi = new MockErrorApi();
      featureFlags = new MultiStorageFeatureFlags({
        storageApi: WebStorage.create({ errorApi }),
      });
      featureFlags.registerFlag({
        name: 'registered-flag-1',
        persisted: false,
        pluginId: 'plugin-one',
      });
      featureFlags.registerFlag({
        name: 'registered-flag-2',
        persisted: false,
        pluginId: 'plugin-one',
      });
      featureFlags.registerFlag({
        name: 'registered-flag-3',
        persisted: false,
        pluginId: 'plugin-two',
      });
    });

    it('should return an empty list', () => {
      featureFlags = new MultiStorageFeatureFlags({
        storageApi: WebStorage.create({ errorApi }),
      });
      expect(featureFlags.getRegisteredFlags()).toEqual([]);
    });

    it('should return an valid list', () => {
      expect(featureFlags.getRegisteredFlags()).toEqual([
        { name: 'registered-flag-1', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-2', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-3', persisted: false, pluginId: 'plugin-two' },
      ]);
    });

    it('should provide a copy of the list of flags', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(flags).toEqual([
        { name: 'registered-flag-1', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-2', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-3', persisted: false, pluginId: 'plugin-two' },
      ]);
      flags.splice(2, 1);
      expect(flags).toEqual([
        { name: 'registered-flag-1', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-2', persisted: false, pluginId: 'plugin-one' },
      ]);
      expect(featureFlags.getRegisteredFlags()).toEqual([
        { name: 'registered-flag-1', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-2', persisted: false, pluginId: 'plugin-one' },
        { name: 'registered-flag-3', persisted: false, pluginId: 'plugin-two' },
      ]);
    });

    it('should get the correct values', () => {
      const getByName = (name: string) =>
        featureFlags.getRegisteredFlags().find(flag => flag.name === name);

      expect(getByName('registered-flag-0')).toBeUndefined();
      expect(getByName('registered-flag-1')).toEqual({
        name: 'registered-flag-1',
        persisted: false,
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-2')).toEqual({
        name: 'registered-flag-2',
        persisted: false,
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-3')).toEqual({
        name: 'registered-flag-3',
        persisted: false,
        pluginId: 'plugin-two',
      });
    });

    it('throws an error if length is less than three characters', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: 'ab',
          persisted: false,
          pluginId: 'plugin-three',
        }),
      ).toThrow(/minimum length of three characters/i);
    });

    it('throws an error if length is greater than 150 characters', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: 'loremipsumdolorsitametconsecteturadipiscingelitnuncvitaeportaexaullamcorperturpismaurisutmattisnequemorbisediaculisauguevivamuspulvinarcursuseratblandithendreritquisqueuttinciduntmagnavestibulumblanditaugueat',
          persisted: false,
          pluginId: 'plugin-three',
        }),
      ).toThrow(/not exceed 150 characters/i);
    });

    it('throws an error if name does not start with a lowercase letter', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: '123456789',
          persisted: false,
          pluginId: 'plugin-three',
        }),
      ).toThrow(/start with a lowercase letter/i);
    });

    it('throws an error if name contains characters other than lowercase letters, numbers and hyphens', () => {
      expect(() =>
        featureFlags.registerFlag({
          name: 'Invalid_Feature_Flag',
          persisted: false,
          pluginId: 'plugin-three',
        }),
      ).toThrow(/only contain lowercase letters, numbers and hyphens/i);
    });
  });
});

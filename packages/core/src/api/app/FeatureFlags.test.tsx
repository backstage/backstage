/*
 * Copyright 2020 Spotify AB
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

import { FeatureFlags as FeatureFlagsImpl } from './FeatureFlags';
import { FeatureFlagState } from '../apis/definitions/featureFlags';

describe('FeatureFlags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('#getFlags', () => {
    let featureFlags;

    beforeEach(() => {
      featureFlags = new FeatureFlagsImpl();
    });

    it('returns no flags', () => {
      expect(featureFlags.getFlags().toObject()).toMatchObject({});
    });

    it('returns the correct flags', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
        }),
      );

      expect(featureFlags.getFlags().toObject()).toMatchObject({
        'feature-flag-one': FeatureFlagState.Enabled,
        'feature-flag-two': FeatureFlagState.Enabled,
        'feature-flag-three': FeatureFlagState.NotEnabled,
      });
    });

    it('gets the correct values', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 0,
        }),
      );

      expect(featureFlags.getFlags().get('feature-flag-one')).toEqual(
        FeatureFlagState.Enabled,
      );
      expect(featureFlags.getFlags().get('feature-flag-two')).toEqual(
        FeatureFlagState.NotEnabled,
      );
      expect(featureFlags.getFlags().get('feature-flag-three')).toEqual(
        FeatureFlagState.NotEnabled,
      );
    });

    it('sets the correct values', () => {
      const flags = featureFlags.getFlags();
      flags.set('feature-flag-zero', FeatureFlagState.Enabled);

      expect(flags.get('feature-flag-zero')).toEqual(FeatureFlagState.Enabled);
      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-zero":1}',
      );
    });

    it('deletes the correct values', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 0,
        }),
      );

      const flags = featureFlags.getFlags();
      flags.delete('feature-flag-one');

      expect(flags.get('feature-flag-one')).toEqual(
        FeatureFlagState.NotEnabled,
      );
      expect(window.localStorage.getItem('featureFlags')).toEqual(
        '{"feature-flag-two":0}',
      );
    });

    it('clears all values', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': 1,
          'feature-flag-two': 1,
          'feature-flag-three': 0,
        }),
      );

      const flags = featureFlags.getFlags();
      flags.clear();

      expect(flags.toObject()).toEqual({});
      expect(window.localStorage.getItem('featureFlags')).toEqual('{}');
    });
  });

  describe('#getRegisteredFlags', () => {
    let featureFlags;

    beforeEach(() => {
      featureFlags = new FeatureFlagsImpl();
      featureFlags.registeredFeatureFlags = [
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
      ];
    });

    it('should return an empty list', () => {
      featureFlags.registeredFeatureFlags = [];
      expect(featureFlags.getRegisteredFlags().toObject()).toEqual([]);
    });

    it('should return an valid list', () => {
      expect(featureFlags.getRegisteredFlags().toObject()).toMatchObject([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
      ]);
    });

    it('should get the correct values', () => {
      const getByName = name =>
        featureFlags.getRegisteredFlags().find(flag => flag.name === name);

      expect(getByName('registered-flag-0')).toBeUndefined();
      expect(getByName('registered-flag-1')).toEqual({
        name: 'registered-flag-1',
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-2')).toEqual({
        name: 'registered-flag-2',
        pluginId: 'plugin-one',
      });
      expect(getByName('registered-flag-3')).toEqual({
        name: 'registered-flag-3',
        pluginId: 'plugin-two',
      });
    });

    it('should append the correct value', () => {
      const flags = featureFlags.getRegisteredFlags();

      flags.push({
        name: 'registered-flag-4',
        pluginId: 'plugin-three',
      });

      expect(flags.toObject()).toMatchObject([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
        { name: 'registered-flag-4', pluginId: 'plugin-three' },
      ]);
    });

    it('should concat the correct values', () => {
      const flags = featureFlags.getRegisteredFlags();
      const concatValues = flags.concat([
        {
          name: 'registered-flag-4',
          pluginId: 'plugin-three',
        },
        {
          name: 'registered-flag-5',
          pluginId: 'plugin-four',
        },
      ]);

      expect(concatValues).toMatchObject([
        { name: 'registered-flag-1', pluginId: 'plugin-one' },
        { name: 'registered-flag-2', pluginId: 'plugin-one' },
        { name: 'registered-flag-3', pluginId: 'plugin-two' },
        { name: 'registered-flag-4', pluginId: 'plugin-three' },
        { name: 'registered-flag-5', pluginId: 'plugin-four' },
      ]);
    });

    it('throws an error if length is less than three characters', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(() =>
        flags.push({
          name: 'ab',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/minimum length of three characters/i);
    });

    it('throws an error if length is greater than 150 characters', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(() =>
        flags.push({
          name:
            'loremipsumdolorsitametconsecteturadipiscingelitnuncvitaeportaexaullamcorperturpismaurisutmattisnequemorbisediaculisauguevivamuspulvinarcursuseratblandithendreritquisqueuttinciduntmagnavestibulumblanditaugueat',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/not exceed 150 characters/i);
    });

    it('throws an error if name does not start with a lowercase letter', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(() =>
        flags.push({
          name: '123456789',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/start with a lowercase letter/i);
    });

    it('throws an error if name contains characters other than lowercase letters, numbers and hyphens', () => {
      const flags = featureFlags.getRegisteredFlags();
      expect(() =>
        flags.push({
          name: 'Invalid_Feature_Flag',
          pluginId: 'plugin-three',
        }),
      ).toThrow(/only contain lowercase letters, numbers and hyphens/i);
    });
  });
});

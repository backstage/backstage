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

import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import {
  FeatureFlags,
  FeatureFlagsContext,
  FeatureFlagsContextProvider,
} from './FeatureFlags';
import { FeatureFlagState } from '../apis/definitions/featureFlags';

describe('FeatureFlags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('#get', () => {
    it('defaults to .NotEnabled', () => {
      expect(FeatureFlags.get('enable-feature-flag')).toBe(
        FeatureFlagState.NotEnabled,
      );
    });

    it('returns a .Enabled state', () => {
      FeatureFlags.set('enable-feature-flag', FeatureFlagState.Enabled);
      expect(FeatureFlags.get('enable-feature-flag')).toBe(
        FeatureFlagState.Enabled,
      );
    });

    it('returns a .NotEnabled state', () => {
      FeatureFlags.set('enable-feature-flag', FeatureFlagState.NotEnabled);
      expect(FeatureFlags.get('enable-feature-flag')).toBe(
        FeatureFlagState.NotEnabled,
      );
    });
  });

  describe('#set', () => {
    it('fails if name is less than three characters', () => {
      expect(() => {
        FeatureFlags.set('ab', FeatureFlagState.NotEnabled);
      }).toThrow(/minimum length of three characters/i);
    });

    it('fails if name is greater than 150 characters', () => {
      expect(() => {
        FeatureFlags.set(
          'loremipsumdolorsitametconsecteturadipiscingelitnuncvitaeportaexaullamcorperturpismaurisutmattisnequemorbisediaculisauguevivamuspulvinarcursuseratblandithendreritquisqueuttinciduntmagnavestibulumblanditaugueat',
          FeatureFlagState.NotEnabled,
        );
      }).toThrow(/not exceed 150 characters/i);
    });

    it('fails if name does not start with a lowercase letter', () => {
      expect(() => {
        FeatureFlags.set('123456789', FeatureFlagState.NotEnabled);
      }).toThrow(/start with a lowercase letter/i);
    });

    it('fails if name contains characters other than lowercase letters, numbers and hyphens', () => {
      expect(() => {
        FeatureFlags.set('Invalid_Feature_Flag', FeatureFlagState.NotEnabled);
      }).toThrow(/only contain lowercase letters, numbers and hyphens/i);
    });

    it('fails if state is not recognized from FeatureFlagState', () => {
      expect(() => {
        // @ts-ignore
        FeatureFlags.set('valid-feature-flag', 'invalid state');
      }).toThrow(/requires a recognized value from the FeatureFlagState/i);
    });

    it('sets a feature flag to enabled', () => {
      expect(window.localStorage.featureFlags).toBeUndefined();
      FeatureFlags.set('valid-feature-flag', FeatureFlagState.Enabled);
      expect(window.localStorage.featureFlags).toBe(
        '{"valid-feature-flag":true}',
      );
    });

    it('sets a feature flag to disabled', () => {
      expect(window.localStorage.featureFlags).toBeUndefined();
      FeatureFlags.set('valid-feature-flag', FeatureFlagState.NotEnabled);
      expect(window.localStorage.featureFlags).toBe('{}');
    });

    it('sets a feature flag to disabled then enabled', () => {
      expect(window.localStorage.featureFlags).toBeUndefined();
      FeatureFlags.set('valid-feature-flag', FeatureFlagState.NotEnabled);
      FeatureFlags.set('valid-feature-flag', FeatureFlagState.Enabled);
      expect(window.localStorage.featureFlags).toBe(
        '{"valid-feature-flag":true}',
      );
    });

    it('sets multiple feature flags', () => {
      expect(window.localStorage.featureFlags).toBeUndefined();
      FeatureFlags.set('valid-feature-flag', FeatureFlagState.Enabled);
      FeatureFlags.set('another-valid-feature-flag', FeatureFlagState.Enabled);
      expect(window.localStorage.featureFlags).toBe(
        '{"valid-feature-flag":true,"another-valid-feature-flag":true}',
      );
    });
  });
});

describe('FeatureFlagsContext', () => {
  it('returns an empty list without the context', () => {
    expect.assertions(1);

    const Component = () => {
      const { featureFlags } = useContext(FeatureFlagsContext);
      expect(featureFlags).toEqual([]);
      return null;
    };

    render(<Component />);
  });

  it('returns a list of registered feature flags', () => {
    expect.assertions(1);

    const mockFeatureFlags = [
      { name: 'feature-flag-one', pluginId: 'plugin-one' },
      { name: 'feature-flag-two', pluginId: 'plugin-two' },
    ];

    const Component = () => {
      const { featureFlags } = useContext(FeatureFlagsContext);
      expect(featureFlags).toBe(mockFeatureFlags);
      return null;
    };

    render(
      <FeatureFlagsContextProvider featureFlags={mockFeatureFlags}>
        <Component />
      </FeatureFlagsContextProvider>,
    );
  });
});

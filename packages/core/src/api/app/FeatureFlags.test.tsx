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

import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { render } from '@testing-library/react';
import { FeatureFlags } from './FeatureFlags';
import { FeatureFlagState } from '../apis/definitions/featureFlags';

function useRenderCount() {
  const renderCount = useRef(-1);
  renderCount.current += 1;
  return renderCount.current;
}

function withFeatureFlags(
  children: ReactNode,
  featureFlags: Set<FeatureFlagsEntry> = new Set([
    { name: 'feature-flag-one', pluginId: 'plugin-one' },
    { name: 'feature-flag-two', pluginId: 'plugin-two' },
    { name: 'feature-flag-three', pluginId: 'plugin-two' },
  ]),
) {}

describe('FeatureFlags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('#getEnabledFeatureFlags', () => {
    it('returns an empty set', () => {
      expect(FeatureFlags.getEnabledFeatureFlags()).toEqual(new Set());
    });

    it('returns enabled feature flags', () => {
      window.localStorage.setItem(
        'featureFlags',
        JSON.stringify({
          'feature-flag-one': true,
          'feature-flag-three': true,
        }),
      );

      expect(FeatureFlags.getEnabledFeatureFlags()).toEqual(
        new Set(['feature-flag-one', 'feature-flag-three']),
      );
    });
  });

  describe('#checkFeatureFlagNameErrors', () => {
    it('returns an error if less than three characters', () => {
      const errors = FeatureFlags.checkFeatureFlagNameErrors('ab');
      expect(errors[0]).toMatch(/minimum length of three characters/i);
    });

    it('returns an error if greater than 150 characters', () => {
      const errors = FeatureFlags.checkFeatureFlagNameErrors(
        'loremipsumdolorsitametconsecteturadipiscingelitnuncvitaeportaexaullamcorperturpismaurisutmattisnequemorbisediaculisauguevivamuspulvinarcursuseratblandithendreritquisqueuttinciduntmagnavestibulumblanditaugueat',
      );
      expect(errors[0]).toMatch(/not exceed 150 characters/i);
    });

    it('returns an error if name does not start with a lowercase letter', () => {
      const errors = FeatureFlags.checkFeatureFlagNameErrors('123456789');
      expect(errors[0]).toMatch(/start with a lowercase letter/i);
    });

    it('returns an error if name contains characters other than lowercase letters, numbers and hyphens', () => {
      const errors = FeatureFlags.checkFeatureFlagNameErrors(
        'Invalid_Feature_Flag',
      );
      expect(errors[0]).toMatch(
        /only contain lowercase letters, numbers and hyphens/i,
      );
    });

    it('returns no errors', () => {
      const errors = FeatureFlags.checkFeatureFlagNameErrors(
        'valid-feature-flag',
      );
      expect(errors.length).toBe(0);
    });
  });

  describe('#useFeatureFlag', () => {
    it('throws an error if the feature flag is not registered', () => {
      const Component = () => {
        expect(() => {
          FeatureFlags.useFeatureFlag('feature-flag-four');
        }).toThrow(/'feature-flag-four' feature flag is not registered/i);

        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('throws an error if changing value is not recognized', () => {
      const Component = () => {
        const [, setState] = FeatureFlags.useFeatureFlag('feature-flag-one');
        const renderCount = useRenderCount();
        if (renderCount === 1) {
          // @ts-ignore
          expect(() => setState('not valid')).toThrow(
            /requires a recognized value from the FeatureFlagState/i,
          );
        }
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('defaults to .NotEnabled', () => {
      const Component = () => {
        const renderCount = useRenderCount();
        const [state] = FeatureFlags.useFeatureFlag('feature-flag-one');
        if (renderCount === 1) {
          expect(state).toEqual(FeatureFlagState.NotEnabled);
        }
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('returns an .Enabled state', () => {
      window.localStorage.setItem('featureFlags', '{"feature-flag-one":true}');

      const Component = () => {
        const [state] = FeatureFlags.useFeatureFlag('feature-flag-one');
        const renderCount = useRenderCount();
        if (renderCount === 1) {
          expect(state).toEqual(FeatureFlagState.Enabled);
        }
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('returns an .NotEnabled state', () => {
      const Component = () => {
        const [state] = FeatureFlags.useFeatureFlag('feature-flag-one');
        const renderCount = useRenderCount();
        if (renderCount === 1) {
          expect(state).toEqual(FeatureFlagState.NotEnabled);
        }
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('changes state to .Enabled', () => {
      const Component = () => {
        const [state, setState] = FeatureFlags.useFeatureFlag(
          'feature-flag-one',
        );
        const renderCount = useRenderCount();
        if (renderCount === 1) setState(FeatureFlagState.Enabled);
        if (renderCount === 2) expect(state).toEqual(FeatureFlagState.Enabled);
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('changes state to .NotEnabled', () => {
      window.localStorage.setItem('featureFlags', '{"feature-flag-one":true}');

      const Component = () => {
        const [state, setState] = FeatureFlags.useFeatureFlag(
          'feature-flag-one',
        );
        const renderCount = useRenderCount();
        if (renderCount === 1) setState(FeatureFlagState.NotEnabled);
        if (renderCount === 2)
          expect(state).toEqual(FeatureFlagState.NotEnabled);
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('changes state to .Enabled then .NotEnabled', () => {
      const Component = () => {
        const [state, setState] = FeatureFlags.useFeatureFlag(
          'feature-flag-one',
        );
        const renderCount = useRenderCount();
        if (renderCount === 1) setState(FeatureFlagState.Enabled);
        if (renderCount === 2) setState(FeatureFlagState.NotEnabled);
        if (renderCount === 3)
          expect(state).toEqual(FeatureFlagState.NotEnabled);
        return null;
      };

      render(withFeatureFlags(<Component />));
    });

    it('changes multiple feature flag states', () => {
      expect.assertions(3);

      const Component = () => {
        const renderCount = useRenderCount();
        const [stateA, setStateA] = FeatureFlags.useFeatureFlag(
          'feature-flag-one',
        );
        const [stateB, setStateB] = FeatureFlags.useFeatureFlag(
          'feature-flag-two',
        );

        useEffect(() => {
          if (renderCount === 1) {
            setStateA(FeatureFlagState.Enabled);
            setStateB(FeatureFlagState.Enabled);
          }
          if (renderCount === 2) {
            expect(stateA).toEqual(FeatureFlagState.Enabled);
            expect(stateB).toEqual(FeatureFlagState.Enabled);
            expect(window.localStorage.getItem('featureFlags')).toEqual(
              '{"feature-flag-one":true,"feature-flag-two":true}',
            );
          }
        }, [renderCount]);

        return null;
      };

      render(withFeatureFlags(<Component />));
    });
  });
});

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

import React, { ReactNode, createContext, FC } from 'react';
import { FeatureFlagName } from '../plugin/types';
import {
  FeatureFlagState,
  FeatureFlagsApi,
} from '../apis/definitions/featureFlags';

// TODO: figure out where to put implementations of APIs, both inside apps
// but also in core/separate package.
class FeatureFlagsImpl implements FeatureFlagsApi {
  private readonly localStorageKey = 'featureFlags';

  private getUserEnabledFeatureFlags(): Set<FeatureFlagName> {
    if (!('localStorage' in window)) {
      throw new Error(
        'Feature Flags are not supported on browsers without the Local Storage API',
      );
    }

    try {
      const featureFlagsJson = window.localStorage.getItem(
        this.localStorageKey,
      );
      return new Set<FeatureFlagName>(
        Object.keys(JSON.parse(featureFlagsJson!)),
      );
    } catch (err) {
      return new Set<FeatureFlagName>();
    }
  }

  get(name: FeatureFlagName): FeatureFlagState {
    if (this.getUserEnabledFeatureFlags().has(name)) {
      return FeatureFlagState.Enabled;
    }

    return FeatureFlagState.NotEnabled;
  }

  set(name: FeatureFlagName, state: FeatureFlagState): void {
    const flags = this.getUserEnabledFeatureFlags();

    if (name.length < 3) {
      throw new Error(
        'The `name` argument must have a minimum length of three characters.',
      );
    }

    if (name.length > 150) {
      throw new Error('The `name` argument must not exceed 150 characters.');
    }

    if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
      throw new Error(
        'The `name` argument must start with a lowercase letter and only contain lowercase letters, numbers and hyphens.' +
          'Examples: feature-flag-one, alpha, release-2020',
      );
    }

    if (state === FeatureFlagState.Enabled) {
      flags.add(name);
    } else if (state === FeatureFlagState.NotEnabled) {
      flags.delete(name);
    } else {
      throw new Error(
        'The `state` argument requires a recognized value from the FeatureFlagState enum. ' +
          'Please check the Backstage documentation to see all the available options.' +
          'Example values: FeatureFlagState.NotEnabled, FeatureFlagState.Enabled',
      );
    }

    window.localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(
        [...flags].reduce((list, flag) => ({ ...list, [flag]: true }), {}),
      ),
    );
  }
}

export const FeatureFlags = new FeatureFlagsImpl();

/**
 * Create a shared React context for Feature Flags.
 *
 * This will be used to propagate all available feature flags to
 * Backstage components. This enables viewing all of the available flags.
 */
export interface FeatureFlagsEntry {
  pluginId: string;
  name: FeatureFlagName;
}

export const FeatureFlagsContext = createContext<{
  registeredFeatureFlags: FeatureFlagsEntry[];
}>({
  registeredFeatureFlags: [],
});

interface Props {
  registeredFeatureFlags: FeatureFlagsEntry[];
  children: ReactNode;
}

export const FeatureFlagsContextProvider: FC<Props> = ({
  registeredFeatureFlags,
  children,
}) => (
  <FeatureFlagsContext.Provider
    value={{ registeredFeatureFlags }}
    children={children}
  />
);

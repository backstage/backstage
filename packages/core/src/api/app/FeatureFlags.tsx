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

import { FeatureFlagName } from '../plugin/types';
import {
  FeatureFlagState,
  FeatureFlagsApi,
} from '../apis/definitions/featureFlags';

export interface FeatureFlagsEntry {
  pluginId: string;
  name: FeatureFlagName;
}

/**
 * Create the FeatureFlags implementation based on the API.
 */

// TODO: figure out where to put implementations of APIs, both inside apps
// but also in core/separate package.
class FeatureFlagsImpl implements FeatureFlagsApi {
  private readonly localStorageKey = 'featureFlags';

  public constructor(public registeredFeatureFlags: FeatureFlagsEntry[] = []) {}

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

  // We don't make this private as we need this to validate
  // in the `registerFeatureFlag` method in the Plugin API.
  checkFeatureFlagNameErrors(name: FeatureFlagName): string[] {
    const errors: string[] = [];

    if (name.length < 3) {
      errors.push('The name must have a minimum length of three characters.');
    }

    if (name.length > 150) {
      errors.push('The name must not exceed 150 characters.');
    }

    if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
      errors.push(
        'The name must start with a lowercase letter and only contain lowercase letters, numbers and hyphens. ' +
          'Examples: feature-flag-one, alpha, release-2020',
      );
    }

    return errors;
  }

  useFeatureFlag(
    name: FeatureFlagName,
  ): [FeatureFlagState, (state: FeatureFlagState) => void] {
    // Check for context
    const context = useContext(FeatureFlagsContext);
    if (!context) {
      throw new Error(
        'No FeatureFlagsContext found. ' +
          'Please use this React Hook in the context of your <App />',
      );
    }

    // Check for errors
    // eslint-disable-next-line no-use-before-define
    const errors = FeatureFlags.checkFeatureFlagNameErrors(name);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    // Check if the feature flag is registered
    const allFlagNames = [...context.featureFlags].map(flag => flag.name);
    if (!allFlagNames.includes(name)) {
      throw new Error(
        `The '${name}' feature flag is not registered by any plugin. ` +
          `See the 'registerFeatureFlag' method in the Plugin API (or in your plugin.ts file) on how to register Feature Flags.`,
      );
    }

    // eslint-disable-next-line no-use-before-define
    const currentState = FeatureFlags.get(context.enabledFeatureFlags, name);
    const setState = (state: FeatureFlagState): void => {
      // Set the value
      // eslint-disable-next-line no-use-before-define
      FeatureFlags.set(name, state);

      // Now update the global state
      context.refreshEnabledFeatureFlags();
    };

    return [currentState, setState];
  }
}

export const FeatureFlags = new FeatureFlagsImpl();

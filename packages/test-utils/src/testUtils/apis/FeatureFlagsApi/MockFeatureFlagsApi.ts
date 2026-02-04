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

import {
  FeatureFlagsApi,
  FeatureFlag,
  FeatureFlagsSaveOptions,
  FeatureFlagState,
} from '@backstage/core-plugin-api';

/**
 * Options for configuring {@link MockFeatureFlagsApi}.
 *
 * @public
 */
export interface MockFeatureFlagsApiOptions {
  /**
   * Initial feature flag states.
   */
  initialStates?: Record<string, FeatureFlagState>;
}

/**
 * Mock implementation of {@link core-plugin-api#FeatureFlagsApi} for testing feature flag behavior.
 *
 * @public
 */
export class MockFeatureFlagsApi implements FeatureFlagsApi {
  private registeredFlags: FeatureFlag[] = [];
  private states: Map<string, FeatureFlagState>;

  constructor(options?: MockFeatureFlagsApiOptions) {
    this.states = new Map(Object.entries(options?.initialStates ?? {}));
  }

  registerFlag(flag: FeatureFlag): void {
    if (!this.registeredFlags.some(f => f.name === flag.name)) {
      this.registeredFlags.push(flag);
    }
  }

  getRegisteredFlags(): FeatureFlag[] {
    return [...this.registeredFlags];
  }

  isActive(name: string): boolean {
    return this.states.get(name) === FeatureFlagState.Active;
  }

  save(options: FeatureFlagsSaveOptions): void {
    if (options.merge) {
      for (const [name, state] of Object.entries(options.states)) {
        this.states.set(name, state);
      }
    } else {
      this.states = new Map(Object.entries(options.states));
    }
  }

  getStates(): Record<string, FeatureFlagState> {
    return Object.fromEntries(this.states);
  }
}

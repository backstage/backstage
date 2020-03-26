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

// import React, { createContext, useContext, useState, FC } from 'react';
import { FeatureFlagName } from '../plugin/types';
import { FeatureFlagsApi } from '../apis/definitions/featureFlags';

// TODO: figure out where to put implementations of APIs, both inside apps
// but also in core/separate package.
export class FeatureFlags implements FeatureFlagsApi {
  private static readonly localStorageKey = 'featureFlags';

  private static getEnabledFeatureFlags(): Set<FeatureFlagName> {
    if (!('localStorage' in window)) {
      throw new Error(
        'Feature Flags are not supported on browsers without the Local Storage API',
      );
    }

    try {
      const featureFlagsJson = window.localStorage.getItem(
        this.localStorageKey,
      );
      return new Set<>(Object.keys(JSON.parse(featureFlagsJson!)));
    } catch (err) {
      return new Set<>();
    }
  }

  private static saveFeatureFlags(flags: Set<FeatureFlagName>): void {
    if (!('localStorage' in window)) {
      throw new Error(
        'Feature Flags are not supported on browsers without the Local Storage API',
      );
    }

    window.localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(
        [...flags].reduce((list, flag) => ({ ...list, [flag]: true }), {}),
      ),
    );
  }

  static getItem(name: FeatureFlagName): boolean {
    return this.getFeatureFlags().has(name);
  }

  static enable(name: FeatureFlagName): void {
    const flags = this.getFeatureFlags();
    flags.add(name);
    this.saveFeatureFlags(flags);
  }

  static disable(name: FeatureFlagName): void {
    const flags = this.getFeatureFlags();
    flags.delete(name);
    this.saveFeatureFlags(flags);
  }
}

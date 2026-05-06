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
  FeatureFlagState,
  FeatureFlagsApi,
  FeatureFlag,
  FeatureFlagsSaveOptions,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

export function validateFlagName(name: string): void {
  if (name.length < 3) {
    throw new Error(
      `The '${name}' feature flag must have a minimum length of three characters.`,
    );
  }

  if (name.length > 150) {
    throw new Error(
      `The '${name}' feature flag must not exceed 150 characters.`,
    );
  }

  if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
    throw new Error(
      `The '${name}' feature flag must start with a lowercase letter and only contain lowercase letters, numbers and hyphens. ` +
        'Examples: feature-flag-one, alpha, release-2020',
    );
  }
}

/**
 * A feature flags implementation that stores the flags in the browser's local
 * storage.
 *
 * @public
 */
export class LocalStorageFeatureFlags implements FeatureFlagsApi {
  private registeredFeatureFlags: FeatureFlag[] = [];
  private flags?: Map<string, FeatureFlagState>;

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<{ active: ReadonlySet<string> }>
  >();

  private readonly observable = new ObservableImpl<{
    active: ReadonlySet<string>;
  }>(subscriber => {
    subscriber.next(this.snapshotActive());
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  registerFlag(flag: FeatureFlag) {
    validateFlagName(flag.name);
    this.registeredFeatureFlags.push(flag);
  }

  getRegisteredFlags(): FeatureFlag[] {
    return this.registeredFeatureFlags.slice();
  }

  isActive(name: string): boolean {
    if (!this.flags) {
      this.flags = this.load();
    }
    return this.flags.get(name) === FeatureFlagState.Active;
  }

  save(options: FeatureFlagsSaveOptions): void {
    if (!this.flags) {
      this.flags = this.load();
    }
    if (!options.merge) {
      this.flags.clear();
    }
    for (const [name, state] of Object.entries(options.states)) {
      this.flags.set(name, state);
    }

    const enabled = Array.from(this.flags.entries()).filter(
      ([, state]) => state === FeatureFlagState.Active,
    );
    window.localStorage.setItem(
      'featureFlags',
      JSON.stringify(Object.fromEntries(enabled)),
    );

    const snapshot = this.snapshotActive();
    for (const subscriber of this.subscribers) {
      subscriber.next(snapshot);
    }
  }

  state$(): Observable<{ active: ReadonlySet<string> }> {
    return this.observable;
  }

  private snapshotActive(): { active: ReadonlySet<string> } {
    if (!this.flags) {
      this.flags = this.load();
    }
    const active = new Set<string>();
    for (const [name, state] of this.flags.entries()) {
      if (state === FeatureFlagState.Active) {
        active.add(name);
      }
    }
    return { active };
  }

  private load(): Map<string, FeatureFlagState> {
    try {
      const jsonStr = window.localStorage.getItem('featureFlags');
      if (!jsonStr) {
        return new Map();
      }
      const json = JSON.parse(jsonStr) as unknown;
      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        return new Map();
      }

      const entries = Object.entries(json).filter(([name, value]) => {
        validateFlagName(name);
        return value === FeatureFlagState.Active;
      });

      return new Map(entries);
    } catch {
      return new Map();
    }
  }
}

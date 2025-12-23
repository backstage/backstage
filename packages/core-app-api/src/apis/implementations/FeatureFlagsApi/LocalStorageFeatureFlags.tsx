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

import ZenObservable from 'zen-observable';

import {
  FeatureFlagState,
  FeatureFlagsApi,
  FeatureFlag,
  FeatureFlagsSaveOptions,
} from '@backstage/core-plugin-api';
import type { Observable } from '@backstage/types';

import { validateFlagName } from './validateFlagName';
import { BroadcastSignal } from './BroadcastSignal';

/**
 * A feature flags implementation that stores the flags in the browser's local
 * storage.
 *
 * @public
 */
export class LocalStorageFeatureFlags implements FeatureFlagsApi {
  #signal: BroadcastSignal;
  private registeredFeatureFlags: FeatureFlag[] = [];
  private flags?: Map<string, FeatureFlagState>;

  constructor() {
    this.#signal = new BroadcastSignal((name, state, persisted) => {
      if (!persisted) {
        this.flags?.set(name, state);
      }
    });
  }

  registerFlag(flag: FeatureFlag) {
    validateFlagName(flag.name);
    this.registeredFeatureFlags.push(flag);
  }

  getRegisteredFlags(): FeatureFlag[] {
    return this.registeredFeatureFlags.slice();
  }

  async getFlag(name: string): Promise<boolean> {
    return this.isActive(name);
  }

  async setFlag(name: string, active: boolean): Promise<void> {
    this.save({
      states: {
        [name]: active ? FeatureFlagState.Active : FeatureFlagState.None,
      },
      merge: true,
    });
  }

  observe$(name: string): Observable<boolean> {
    return new ZenObservable(subscriber => {
      subscriber.next(this.isActive(name));
      this.#signal.observe$(name).subscribe({
        next(value) {
          subscriber.next(value);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });
      subscriber.complete();
    });
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

    let removedKeys: string[] = [];
    if (!options.merge) {
      removedKeys = Array.from(this.flags.keys());
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

    for (const name of removedKeys) {
      if (!(name in options.states)) {
        this.#signal.signal(name, FeatureFlagState.None, false);
      }
    }
    for (const [name, state] of Object.entries(options.states)) {
      this.#signal.signal(name, state, false);
    }
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

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
  StorageApi,
} from '@backstage/core-plugin-api';
import type { Observable } from '@backstage/types';

import { validateFlagName } from './validateFlagName';
import { BroadcastSignal } from './BroadcastSignal';

function toState(active: boolean): FeatureFlagState {
  return active ? FeatureFlagState.Active : FeatureFlagState.None;
}
function fromState(state: FeatureFlagState | undefined): boolean | undefined {
  if (typeof state === 'undefined') {
    return undefined;
  }
  return state === FeatureFlagState.Active;
}

/**
 * A feature flags implementation that stores the flags in the browser's local
 * storage as well as using the StorageApi for persistent flags.
 *
 * @public
 */
export class MultiStorageFeatureFlags implements FeatureFlagsApi {
  #isInitialized = false;
  #storageApi: StorageApi;
  #signal: BroadcastSignal;

  private registeredLocalFlags = new Map<string, FeatureFlag>();
  private registeredPersistedFlags = new Map<string, FeatureFlag>();
  private localFlags = new Map<string, FeatureFlagState>();
  private persistedFlags = new Map<string, FeatureFlagState>();

  constructor({ storageApi }: { storageApi: StorageApi }) {
    this.#storageApi = storageApi.forBucket('feature-flags');
    this.#signal = new BroadcastSignal((name, state, persisted) => {
      if (persisted) {
        this.persistedFlags.set(name, state);
      } else {
        this.localFlags.set(name, state);
      }
    });
  }

  #writeLocalFlags(): void {
    const enabled = Array.from(this.localFlags.entries()).filter(
      ([, s]) => s === FeatureFlagState.Active,
    );

    window.localStorage.setItem(
      'featureFlags',
      JSON.stringify(Object.fromEntries(enabled)),
    );
  }

  initialize(): void {
    if (this.#isInitialized) {
      return;
    }
    this.#isInitialized = true;
    this.loadLocal();
    this.loadPersisted();
  }

  registerFlag(flag: FeatureFlag) {
    validateFlagName(flag.name);
    if (flag.persisted) {
      this.registeredPersistedFlags.set(flag.name, flag);
    } else {
      this.registeredLocalFlags.set(flag.name, flag);
    }
  }

  getRegisteredFlags(): FeatureFlag[] {
    return ([] as FeatureFlag[]).concat(
      Array.from(this.registeredLocalFlags.values()),
      Array.from(this.registeredPersistedFlags.values()),
    );
  }

  async getFlag(name: string): Promise<boolean> {
    if (this.registeredPersistedFlags.has(name)) {
      return new Promise<boolean>((resolve, reject) => {
        const subscription = this.#observePersisted$(name).subscribe(
          value => {
            resolve(value);
            subscription.unsubscribe();
          },
          err => {
            reject(err);
            subscription.unsubscribe();
          },
        );
      });
    }

    this.initialize();
    return fromState(this.localFlags.get(name)) ?? false;
  }

  async #setPersistedFlag(
    name: string,
    state: FeatureFlagState,
  ): Promise<void> {
    this.persistedFlags.set(name, state);
    await this.#storageApi.set<FeatureFlagState>(name, state);
  }

  #setLocalFlag(name: string, state: FeatureFlagState): void {
    this.localFlags.set(name, state);

    this.#writeLocalFlags();
  }

  async setFlag(name: string, active: boolean): Promise<void> {
    this.initialize();

    const state = toState(active);
    const persisted = this.registeredPersistedFlags.has(name);

    if (persisted) {
      await this.#setPersistedFlag(name, state);
    } else {
      this.#setLocalFlag(name, state);
    }

    this.#signal.signal(name, state, persisted);
  }

  #observePersisted$(name: string): Observable<boolean> {
    this.initialize();

    return new ZenObservable(subscriber => {
      return this.#storageApi.observe$<FeatureFlagState>(name).subscribe({
        next(snapshot) {
          subscriber.next(snapshot.value === FeatureFlagState.Active);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  }

  observe$(name: string): Observable<boolean> {
    this.initialize();

    const isLocal = this.registeredLocalFlags.has(name);
    const isPersisted = this.registeredPersistedFlags.has(name);

    return new ZenObservable(subscriber => {
      if (isLocal) {
        const enabled = fromState(this.localFlags?.get(name));
        // Signal the current cached value
        subscriber.next(enabled ?? false);
        // Subscribe to changes
        return this.#signal.observe$(name).subscribe(subscriber);
      } else if (isPersisted) {
        const enabled = fromState(this.persistedFlags?.get(name));
        // Signal the current cached value
        if (typeof enabled !== 'undefined') {
          subscriber.next(enabled);
        }
        // Subscribe to changes
        return this.#observePersisted$(name).subscribe(subscriber);
      }

      subscriber.next(false);
      subscriber.complete();
      return undefined;
    });
  }

  // Deprecated
  isActive(name: string): boolean {
    this.initialize();

    if (this.registeredPersistedFlags.has(name)) {
      return this.persistedFlags?.get(name) === FeatureFlagState.Active;
    }
    return this.localFlags?.get(name) === FeatureFlagState.Active;
  }

  // Deprecated
  save(options: FeatureFlagsSaveOptions): void {
    this.initialize();

    let removedKeys: string[] = [];
    if (!options.merge) {
      removedKeys = Array.from(this.localFlags.keys());
      this.localFlags.clear();
    }

    const saveStates = Object.entries(options.states).map(([name, state]) => ({
      name,
      persisted: this.registeredPersistedFlags.has(name),
      state,
    }));

    const localSaves = saveStates.filter(s => !s.persisted);
    const persistedSaves = saveStates.filter(s => s.persisted);

    for (const name of removedKeys) {
      if (!(name in options.states)) {
        this.#signal.signal(name, FeatureFlagState.None, false);
      }
    }

    for (const { name, state } of localSaves) {
      this.localFlags.set(name, state);
      this.#signal.signal(name, state, false);
    }
    this.#writeLocalFlags();

    Promise.all(
      persistedSaves.map(async ({ name, state }) => {
        this.persistedFlags.set(name, state);
        await this.#storageApi.set<FeatureFlagState>(name, state);
        this.#signal.signal(name, state, true);
      }),
    )
      // eslint-disable-next-line no-console
      .catch(error => console.error('Failed to save feature flags', error));
  }

  private loadLocal(): void {
    this.localFlags = (() => {
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
    })();
  }

  // This observes all known persisted feature flags (and loads all them into
  // memory), so that:
  //  * They are synchronously available to plugins using the old synchronous
  //    isActive() function.
  //    Caveat; as the loading is async, any calls to isActive() made before
  //    this has completed will return false negatives.
  //    NOTE; New code should use observe$() or getFlag() which are async-safe
  //    and won't return stale data.
  //  * They are instantly available when observing via observe$()
  //  * The initial values are taken from local feature flags (if they were
  //    converted from a local feature flag to a persisted one)
  private loadPersisted(): void {
    for (const name of this.registeredPersistedFlags.keys()) {
      this.#storageApi.observe$<FeatureFlagState>(name).subscribe(snapshot => {
        let isHandled = false;
        if (snapshot.presence === 'present') {
          this.persistedFlags.set(name, snapshot.value);
          isHandled = true;
        } else if (snapshot.presence === 'absent' && !isHandled) {
          isHandled = true;
          let initialValue = false;
          // This might have been converted from a local feature flag (i.e. if
          // it's in the local feature flag state, but not registered anymore).
          const localState = this.localFlags.get(name);
          if (
            !this.registeredLocalFlags.has(name) &&
            typeof localState !== 'undefined'
          ) {
            initialValue = fromState(localState) ?? false;
            // The flag is no longer registered as local, so remove it
            this.#setLocalFlag(name, FeatureFlagState.None);
            // If multiple tabs are open, there might be a race between clearing
            // the local flag and saving the persisted one. If the stale local
            // flag is active, save it after a while, to let all open tabs
            // settle and potential overwriting of false values to happen first.
            setTimeout(() => {
              this.setFlag(name, initialValue);
            }, 5000);
          }
          this.setFlag(name, initialValue);
          isHandled = true;
        }
      });
    }
  }
}

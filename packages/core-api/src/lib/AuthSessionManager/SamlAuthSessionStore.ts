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

import { SamlAuthSessionManager, GetSessionOptions } from './types';

type Options<T> = {
  manager: SamlAuthSessionManager<T>;
  storageKey: string;
};

export class SamlAuthSessionStore<T> implements SamlAuthSessionManager<T> {
  private readonly manager: SamlAuthSessionManager<T>;
  private readonly storageKey: string;

  constructor(options: Options<T>) {
    const { manager, storageKey } = options;

    this.manager = manager;
    this.storageKey = storageKey;
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    const session = this.loadSession();

    if (session) {
      return session!;
    }

    const newSession = await this.manager.getSession(options);
    this.saveSession(newSession);
    return newSession;
  }

  async removeSession() {
    localStorage.removeItem(this.storageKey);
    await this.manager.removeSession();
  }

  sessionState$() {
    return this.manager.sessionState$();
  }

  private saveSession(session: T | undefined) {
    if (session === undefined) {
      localStorage.removeItem(this.storageKey);
    } else {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(session, (_key, value) => {
          if (value instanceof Set) {
            return {
              __type: 'Set',
              __value: Array.from(value),
            };
          }
          return value;
        }),
      );
    }
  }

  private loadSession(): T | undefined {
    try {
      const sessionJson = localStorage.getItem(this.storageKey);
      if (sessionJson) {
        const session = JSON.parse(sessionJson, (_key, value) => {
          if (value?.__type === 'Set') {
            return new Set(value.__value);
          }
          return value;
        });
        return session;
      }

      return undefined;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      return undefined;
    }
  }
}

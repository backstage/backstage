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

import { ZodSchema } from 'zod';
import {
  MutableSessionManager,
  SessionScopesFunc,
  SessionShouldRefreshFunc,
  GetSessionOptions,
} from './types';
import { SessionScopeHelper } from './common';

type Options<T> = {
  /** The connector used for acting on the auth session */
  manager: MutableSessionManager<T>;
  /** Storage key to use to store sessions */
  storageKey: string;
  /** The schema used to validate the stored data */
  schema: ZodSchema<T>;
  /** Used to get the scope of the session */
  sessionScopes?: SessionScopesFunc<T>;
  /** Used to check if the session needs to be refreshed, defaults to never refresh */
  sessionShouldRefresh?: SessionShouldRefreshFunc<T>;
};

/**
 * AuthSessionStore decorates another SessionManager with a functionality
 * to store the session in local storage.
 *
 * Session is serialized to JSON with special support for following types: Set.
 */
export class AuthSessionStore<T> implements MutableSessionManager<T> {
  private readonly manager: MutableSessionManager<T>;
  private readonly storageKey: string;
  private readonly schema: ZodSchema<T>;
  private readonly sessionShouldRefreshFunc: SessionShouldRefreshFunc<T>;
  private readonly helper: SessionScopeHelper<T>;

  constructor(options: Options<T>) {
    const {
      manager,
      storageKey,
      schema,
      sessionScopes,
      sessionShouldRefresh = () => false,
    } = options;

    this.manager = manager;
    this.storageKey = storageKey;
    this.schema = schema;
    this.sessionShouldRefreshFunc = sessionShouldRefresh;
    this.helper = new SessionScopeHelper({
      sessionScopes,
      defaultScopes: new Set(),
    });
  }

  setSession(session: T | undefined): void {
    this.manager.setSession(session);
    this.saveSession(session);
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    const { scopes } = options;
    const session = this.loadSession();

    if (this.helper.sessionExistsAndHasScope(session, scopes)) {
      const shouldRefresh = this.sessionShouldRefreshFunc(session!);

      if (!shouldRefresh) {
        this.manager.setSession(session!);
        return session!;
      }
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

        try {
          return this.schema.parse(session);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(
            `Failed to load session from local storage because it did not conform to the expected schema, ${e}`,
          );
          throw e;
        }
      }

      return undefined;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      return undefined;
    }
  }

  private saveSession(session: T | undefined) {
    if (session === undefined) {
      localStorage.removeItem(this.storageKey);
      return;
    }

    try {
      this.schema.parse(session);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to save session to local storage because it did not conform to the expected schema, ${e}`,
      );
      return;
    }

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

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

/**
 * A sessions manager keeps track of the current session and makes sure that
 * multiple simultaneous requests for sessions with different scope are handled
 * in a correct way.
 */
export type SessionManager<AuthSession> = {
  getSession(options: {
    optional: false;
    scopes?: Set<string>;
  }): Promise<AuthSession>;
  getSession(options: {
    optional?: boolean;
    scopes?: Set<string>;
  }): Promise<AuthSession | undefined>;

  removeSession(): Promise<void>;
};

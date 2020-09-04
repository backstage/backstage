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

import { SessionManager, GetSessionOptions } from './types';
import { SamlAuthConnector, SamlResponse } from '../AuthConnector/SamlAuthConnector';
import { SessionStateTracker } from './SessionStateTracker';


type Options = {
  connector: SamlAuthConnector<SamlResponse>;
};

export class SamlAuthSessionManager<T> implements SessionManager<T> {
  private readonly connector: SamlAuthConnector<SamlResponse>;
  private readonly stateTracker = new SessionStateTracker();

  private currentSession: any | undefined; // FIXME: proper typing here

  constructor(options: Options) {
    const { connector } = options;

    this.connector = connector;
    // this.helper = new SessionScopeHelper
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    // eslint-disable-next-line no-console
    console.log('==> this is from SamlAuthSessionManager getSession()');
    if (this.currentSession) {
      return this.currentSession;
    }

    if (options.optional) {
      return undefined;
    }

    this.currentSession = await this.connector.createSession();
    this.stateTracker.setIsSignedIn(true);
    return this.currentSession;
  }

  async removeSession() {
    this.currentSession = undefined;
    await this.connector.removeSession();
    this.stateTracker.setIsSignedIn(false);
  }

  sessionState$() {
    return this.stateTracker.sessionState$();
  }
}

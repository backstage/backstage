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
  DefaultIdentityClient,
  IdentityClientOptions,
} from './DefaultIdentityClient';
import { BackstageIdentityResponse } from './types';

/**
 * An identity client to interact with auth-backend and authenticate Backstage
 * tokens
 *
 * @public
 * @experimental This is not a stable API yet
 * @deprecated Please migrate to the DefaultIdentityClient.
 */
export class IdentityClient {
  private readonly defaultIdentityClient: DefaultIdentityClient;
  static create(options: IdentityClientOptions): IdentityClient {
    return new IdentityClient(DefaultIdentityClient.create(options));
  }

  private constructor(defaultIdentityClient: DefaultIdentityClient) {
    this.defaultIdentityClient = defaultIdentityClient;
  }

  /**
   * Verifies the given backstage identity token
   * Returns a BackstageIdentity (user) matching the token.
   * The method throws an error if verification fails.
   *
   * @deprecated You should start to use IdentityApi#getIdentity instead of authenticate
   * to retrieve the user identity.
   */
  async authenticate(
    token: string | undefined,
  ): Promise<BackstageIdentityResponse> {
    return await this.defaultIdentityClient.authenticate(token);
  }
}

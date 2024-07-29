/*
 * Copyright 2024 The Backstage Authors
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

import { DiscoveryApi, AuthErrorApi } from '@backstage/core-plugin-api';
import { deserializeError } from '@backstage/errors';

/**
 * The default implementation of the AuthErrorApi, which simply calls auth error endpoint.
 * @public
 */
export class SignInAuthErrorApi implements AuthErrorApi {
  private constructor(private readonly discoveryApi: DiscoveryApi) {}

  static create(options: { discovery: DiscoveryApi }) {
    const { discovery } = options;
    return new SignInAuthErrorApi(discovery);
  }

  async getSignInAuthError(): Promise<Error | undefined> {
    const baseUrl = await this.discoveryApi.getBaseUrl('auth');

    // use native fetch instead of depending on fetchApi because
    // we are not signed in and are calling an unauthenticated endpoint
    const response = await fetch(`${baseUrl}/.backstage/error`, {
      credentials: 'include',
    });
    const data = await response.json();

    return data ? deserializeError(data) : undefined;
  }
}

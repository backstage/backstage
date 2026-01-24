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
  OAuthRequestApi,
  OAuthRequesterOptions,
  PendingOAuthRequest,
} from '@backstage/core-plugin-api';
import { OAuthRequestManager } from './OAuthRequestManager';

export default class MockOAuthApi implements OAuthRequestApi {
  private readonly real = new OAuthRequestManager();
  private requests: PendingOAuthRequest[] = [];

  constructor() {
    this.authRequest$().subscribe(requests => {
      this.requests = requests;
    });
  }

  createAuthRequester<T>(options: OAuthRequesterOptions<T>) {
    return this.real.createAuthRequester(options);
  }

  authRequest$() {
    return this.real.authRequest$();
  }

  async triggerAll() {
    await Promise.resolve(); // Wait a tick to allow new requests to get forwarded

    return Promise.all(this.requests.map(request => request.trigger()));
  }

  async rejectAll() {
    await Promise.resolve(); // Wait a tick to allow new requests to get forwarded

    this.requests.forEach(request => request.reject());
  }
}

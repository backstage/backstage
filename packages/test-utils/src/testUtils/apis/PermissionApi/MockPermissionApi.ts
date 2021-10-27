/*
 * Copyright 2021 The Backstage Authors
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

import { PermissionApi } from '@backstage/core-plugin-api';
import {
  AuthorizeRequest,
  AuthorizeResponse,
  AuthorizeResult,
} from '@backstage/permission-common';

/**
 * Mock implementation of {@link core-plugin-api#PermissionApi}. Supply a
 * requestHandler function to override the mock result returned for a given
 * request.
 * @public
 */
export class MockPermissionApi implements PermissionApi {
  constructor(
    private readonly requestHandler: (
      request: AuthorizeRequest,
    ) => AuthorizeResult.ALLOW | AuthorizeResult.DENY = () =>
      AuthorizeResult.ALLOW,
  ) {}

  async authorize(requests: AuthorizeRequest[]): Promise<AuthorizeResponse[]> {
    return requests.map(request => ({ result: this.requestHandler(request) }));
  }
}

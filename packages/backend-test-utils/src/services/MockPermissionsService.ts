/*
 * Copyright 2025 The Backstage Authors
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

import { PermissionsService } from '@backstage/backend-plugin-api';
import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  AuthorizeResult,
  QueryPermissionRequest,
  QueryPermissionResponse,
} from '@backstage/plugin-permission-common';

export class MockPermissionsService implements PermissionsService {
  readonly #result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;

  constructor(options?: {
    result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
  }) {
    this.#result = options?.result ?? AuthorizeResult.ALLOW;
  }

  async authorize(
    requests: AuthorizePermissionRequest[],
  ): Promise<AuthorizePermissionResponse[]> {
    return requests.map(request => ({
      ...request,
      result: this.#result,
    }));
  }

  async authorizeConditional(
    requests: QueryPermissionRequest[],
  ): Promise<QueryPermissionResponse[]> {
    return requests.map(request => ({
      ...request,
      result: this.#result,
    }));
  }
}

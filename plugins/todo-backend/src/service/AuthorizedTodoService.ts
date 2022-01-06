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

import {
  AuthorizeResult,
  PermissionAuthorizer,
} from '@backstage/plugin-permission-common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotAllowedError } from '@backstage/errors';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common';
import { ListTodosRequest, ListTodosResponse, TodoService } from './types';

/** @internal */
export class AuthorizedTodoService implements TodoService {
  readonly #delegate: TodoService;
  readonly #authorizer: PermissionAuthorizer;

  constructor(delegate: TodoService, authorizer: PermissionAuthorizer) {
    this.#delegate = delegate;
    this.#authorizer = authorizer;
  }

  async listTodos(
    req: ListTodosRequest,
    options?: { token?: string },
  ): Promise<ListTodosResponse> {
    // Permissions are only applied when filtering by entity.
    // In practice there is no other way to list TODOs, but if one is
    // added in the future it is important to protect that method too.
    if (req.entity) {
      const resourceRef = stringifyEntityRef(req.entity);
      const [response] = await this.#authorizer.authorize(
        [{ permission: catalogEntityReadPermission, resourceRef }],
        { token: options?.token },
      );
      if (response.result !== AuthorizeResult.ALLOW) {
        throw new NotAllowedError();
      }
    }

    return this.#delegate.listTodos(req, options);
  }
}

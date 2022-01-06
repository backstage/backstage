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
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common';
import { TodoService } from './types';
import { AuthorizedTodoService } from './AuthorizedTodoService';
import { NotAllowedError } from '@backstage/errors';

describe('AuthorizedTodoService', () => {
  const mockService: jest.Mocked<TodoService> = {
    listTodos: jest.fn(),
  };
  const mockAuthorizer: jest.Mocked<PermissionAuthorizer> = {
    authorize: jest.fn(),
  };
  const service = new AuthorizedTodoService(mockService, mockAuthorizer);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pass through requests without an entity filter', async () => {
    const mockRes = { items: [], offset: 0, limit: 10, totalCount: 0 };
    mockService.listTodos.mockResolvedValueOnce(mockRes);

    await expect(service.listTodos({}, {})).resolves.toBe(mockRes);

    expect(mockService.listTodos).toHaveBeenCalledWith({}, {});
    expect(mockAuthorizer.authorize).not.toHaveBeenCalled();
  });

  it('allows authorized reads', async () => {
    const mockRes = { items: [], offset: 0, limit: 10, totalCount: 0 };
    mockService.listTodos.mockResolvedValueOnce(mockRes);
    mockAuthorizer.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.ALLOW },
    ]);

    const req = { entity: { kind: 'k', namespace: 'ns', name: 'n' } };
    const options = { token: 'abc' };
    await expect(service.listTodos(req, options)).resolves.toBe(mockRes);

    expect(mockService.listTodos).toHaveBeenCalledWith(req, options);
    expect(mockAuthorizer.authorize).toHaveBeenCalledWith(
      [{ permission: catalogEntityReadPermission, resourceRef: 'k:ns/n' }],
      { token: 'abc' },
    );
  });

  it('rejects unauthorized reads', async () => {
    mockAuthorizer.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.DENY },
    ]);

    const req = { entity: { kind: 'k', namespace: 'ns', name: 'n' } };
    await expect(service.listTodos(req, {})).rejects.toThrow(NotAllowedError);

    expect(mockService.listTodos).not.toHaveBeenCalled();
    expect(mockAuthorizer.authorize).toHaveBeenCalledWith(
      [{ permission: catalogEntityReadPermission, resourceRef: 'k:ns/n' }],
      {},
    );
  });
});

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

import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { mockCredentials } from '@backstage/backend-test-utils';
import { AuthorizedValidationService } from './AuthorizedValidationService';

describe('AuthorizedValidationService', () => {
  const orchestratorService = {
    process: jest.fn(),
  };
  const permissionApi = {
    authorize: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws Authorization Error on deny', async () => {
    permissionApi.authorize.mockResolvedValueOnce([
      {
        result: AuthorizeResult.DENY,
      },
    ]);
    const authorizedService = new AuthorizedValidationService(
      orchestratorService,
      permissionApi as unknown as ServerPermissionClient,
    );
    const entityProcessingRequest = {
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'your-entity-name',
          namespace: 'default',
          description: 'your-entity-description',
        },
        spec: {
          type: 'service',
          owner: 'team-a',
        },
      },
    };
    await expect(() =>
      authorizedService.process(
        entityProcessingRequest,
        mockCredentials.none(),
      ),
    ).rejects.toThrow(NotAllowedError);
  });

  it('calls process on allow', async () => {
    permissionApi.authorize.mockResolvedValueOnce([
      {
        result: AuthorizeResult.ALLOW,
      },
    ]);
    const authorizedService = new AuthorizedValidationService(
      orchestratorService,
      permissionApi as unknown as ServerPermissionClient,
    );
    const entityProcessingRequest = {
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'your-entity-name',
          namespace: 'default',
          description: 'your-entity-description',
        },
        spec: {
          type: 'service',
          owner: 'team-a',
        },
      },
    };
    await authorizedService.process(
      entityProcessingRequest,
      mockCredentials.none(),
    );
    expect(orchestratorService.process).toHaveBeenCalledWith(
      entityProcessingRequest,
    );
  });
});

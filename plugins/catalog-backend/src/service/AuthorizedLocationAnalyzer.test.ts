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
import { AuthorizedLocationAnalyzer } from './AuthorizedLocationAnalyzer';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { mockCredentials } from '@backstage/backend-test-utils';

describe('AuthorizedLocationAnalyzer', () => {
  const locationAnalyzerService = {
    analyzeLocation: jest.fn(),
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
    const authorizedService = new AuthorizedLocationAnalyzer(
      locationAnalyzerService,
      permissionApi as unknown as ServerPermissionClient,
    );
    await expect(() =>
      authorizedService.analyzeLocation(
        {
          location: {
            type: 'url',
            target: 'https://example.com/path/to/your/catalog-info.yaml',
            presence: 'required',
          },
          catalogFilename: 'catalog-info.yaml',
        },
        mockCredentials.none(),
      ),
    ).rejects.toThrow(NotAllowedError);
  });

  it('calls analyzeLocation on allow', async () => {
    permissionApi.authorize.mockResolvedValueOnce([
      {
        result: AuthorizeResult.ALLOW,
      },
    ]);
    const authorizedService = new AuthorizedLocationAnalyzer(
      locationAnalyzerService,
      permissionApi as unknown as ServerPermissionClient,
    );
    const analyzeLocationRequest = {
      location: {
        type: 'url',
        target: 'https://example.com/path/to/your/catalog-info.yaml',
      },
      catalogFilename: 'catalog-info.yaml',
    };
    await authorizedService.analyzeLocation(
      analyzeLocationRequest,
      mockCredentials.none(),
    );
    expect(locationAnalyzerService.analyzeLocation).toHaveBeenCalledWith(
      analyzeLocationRequest,
      mockCredentials.none(),
    );
  });
});

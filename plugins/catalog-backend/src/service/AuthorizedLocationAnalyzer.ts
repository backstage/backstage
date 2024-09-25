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
import { catalogLocationAnalyzePermission } from '@backstage/plugin-catalog-common/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { LocationAnalyzer } from '@backstage/plugin-catalog-node';
import { AnalyzeLocationRequest } from '@backstage/plugin-catalog-common';
import { AnalyzeLocationResponse } from '@backstage/plugin-catalog-common';

export class AuthorizedLocationAnalyzer implements LocationAnalyzer {
  constructor(
    private readonly service: LocationAnalyzer,
    private readonly permissionApi: PermissionsService,
  ) {}

  async analyzeLocation(
    request: AnalyzeLocationRequest,
    credentials: BackstageCredentials,
  ): Promise<AnalyzeLocationResponse> {
    const authorizeDecision = (
      await this.permissionApi.authorize(
        [
          {
            permission: catalogLocationAnalyzePermission,
          },
        ],
        { credentials: credentials },
      )
    )[0];
    if (authorizeDecision.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError();
    }
    return this.service.analyzeLocation(request, credentials);
  }
}

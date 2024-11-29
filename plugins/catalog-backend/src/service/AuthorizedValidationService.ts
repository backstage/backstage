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
import { catalogEntityValidatePermission } from '@backstage/plugin-catalog-common/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
  EntityProcessingResult,
} from '../processing/types';
import {
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';

export class AuthorizedValidationService {
  constructor(
    private readonly service: CatalogProcessingOrchestrator,
    private readonly permissionApi: PermissionsService,
  ) {}

  async process(
    request: EntityProcessingRequest,
    credentials: BackstageCredentials,
  ): Promise<EntityProcessingResult> {
    const authorizeDecision = (
      await this.permissionApi.authorize(
        [
          {
            permission: catalogEntityValidatePermission,
          },
        ],
        { credentials },
      )
    )[0];

    if (authorizeDecision.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError();
    }
    return this.service.process(request);
  }
}

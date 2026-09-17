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

import type {
  HttpAuthService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import {
  AuthorizeResult,
  type BasicPermission,
} from '@backstage/plugin-permission-common';

import express from 'express';

export async function requirePermission(
  permissionApi: PermissionsService,
  permissionRequired: BasicPermission,
  httpAuth: HttpAuthService,
  req: express.Request,
) {
  const decision = (
    await permissionApi.authorize(
      [
        {
          permission: permissionRequired,
        },
      ],
      {
        credentials: await httpAuth.credentials(req),
      },
    )
  )[0];

  if (decision.result === AuthorizeResult.ALLOW) {
    return;
  }
  throw new NotAllowedError('Unauthorized');
}

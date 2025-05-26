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
  type ResourcePermission,
  type BasicPermission,
} from '@backstage/plugin-permission-common';
import { InputError } from '@backstage/errors';

import express from 'express';

import { ObjectsByEntityRequest } from '../types/types';
import { stringifyEntityRef } from '@backstage/catalog-model';

/**
 * Basic permission check
 */
export async function requirePermission(
  permissions: PermissionsService,
  permissionRequired: BasicPermission,
  httpAuth: HttpAuthService,
  req: express.Request,
) {
  const decision = (
    await permissions.authorize([{ permission: permissionRequired }], {
      credentials: await httpAuth.credentials(req, { allow: ['user'] }),
    })
  )[0];

  if (decision.result === AuthorizeResult.ALLOW) {
    return;
  }
  throw new NotAllowedError('Unauthorized');
}

/**
 * Resource permission check
 *
 * @public
 */
export async function requireResourcePermission(
  permissions: PermissionsService,
  permissionRequired: ResourcePermission,
  httpAuth: HttpAuthService,
  req: express.Request,
) {
  let entityRef: string;

  if (req.query.entityRef) {
    // format for /resources endpoint
    entityRef = req.query.entityRef.toString();
  } else {
    // format for /services/:serviceId endpoint
    const requestBody: ObjectsByEntityRequest = req.body;
    entityRef = stringifyEntityRef(requestBody.entity);
  }

  if (typeof entityRef !== 'string') {
    throw new InputError(`Invalid entityRef, "${entityRef}" not a string`);
  }

  const decision = (
    await permissions.authorize(
      [{ permission: permissionRequired, resourceRef: entityRef }],
      {
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      },
    )
  )[0];

  if (decision.result === AuthorizeResult.ALLOW) {
    return;
  }
  throw new NotAllowedError('Unauthorized');
}

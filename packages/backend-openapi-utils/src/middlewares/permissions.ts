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

import { Request, Response, NextFunction } from 'express';
import { OperationObject } from 'openapi3-ts';
import type {
  HttpAuthService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import type { BasicPermission } from '@backstage/plugin-permission-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { NotFoundError, NotAllowedError } from '@backstage/errors';

type PermissionsExtension = {
  permission: string;
  validateManually?: boolean;
  onDeny?: 403 | 404;
};

interface WithOpenapi {
  openapi?: {
    expressRoute: string;
    openApiRoute: string;
    pathParams: Record<string, string>;
    schema: OperationObject;
    serial: number;
  };
}

interface WithCredentials {
  credentials?: {
    $$type?: '@backstage/BackstageCredentials';
    principal?: unknown;
  };
}

export interface PermissionsMiddlewareOptions {
  permissions: Record<string, BasicPermission>;
}

export function permissionsMiddlewareFactory(
  dependencies: {
    permissions: PermissionsService;
    httpAuth: HttpAuthService;
  },
  options: PermissionsMiddlewareOptions,
) {
  const { permissions } = options;
  const { permissions: permissionsService, httpAuth } = dependencies;

  return async (
    req: Request & WithOpenapi & WithCredentials,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.openapi) {
      next();
      return;
    }

    const operation = req.openapi.schema;
    if (!operation) {
      next();
      return;
    }

    const permissionsConfig = operation['x-backstage-permissions'] as
      | PermissionsExtension
      | undefined;

    if (!permissionsConfig) {
      next();
      return;
    }

    const permission = permissions[permissionsConfig.permission];
    if (!permission) {
      throw new Error(
        `Permission '${permissionsConfig.permission}' not found in permissions registry`,
      );
    }

    if (permissionsConfig.validateManually) {
      next();
      return;
    }

    try {
      const authorizationResponse = (
        await permissionsService.authorize([{ permission }], {
          credentials: await httpAuth.credentials(req),
        })
      )[0];

      if (authorizationResponse.result === AuthorizeResult.DENY) {
        const statusCode = permissionsConfig.onDeny ?? 403;
        if (statusCode === 404) {
          throw new NotFoundError();
        }
        throw new NotAllowedError();
      }

      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

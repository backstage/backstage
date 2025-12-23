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
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { NotFoundError, NotAllowedError } from '@backstage/errors';

type PermissionsExtension = {
  permission: string;
  validateManually?: boolean;
  onDeny?: 403 | 404;
};

/** @public */
export interface WithOpenapi {
  openapi?: {
    expressRoute: string;
    openApiRoute: string;
    pathParams: Record<string, string>;
    schema: OperationObject;
    serial: number;
  };
}

/**
 * Middleware factory that enforces permissions based on OpenAPI operation metadata.
 *
 * @public
 */
export function permissionsMiddlewareFactory(dependencies: {
  permissions: PermissionsService;
  permissionsRegistry: PermissionsRegistryService;
  httpAuth: HttpAuthService;
}) {
  const { permissionsRegistry } = dependencies;
  const registeredPermissions = permissionsRegistry.listPermissions();
  const { permissions: permissionsService, httpAuth } = dependencies;

  return async (
    req: Request & WithOpenapi,
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

    const permission = registeredPermissions.find(
      p => p.name === permissionsConfig.permission,
    );
    if (!permission) {
      throw new Error(
        `Permission '${permissionsConfig.permission}' not found in permissions registry`,
      );
    }

    if (permissionsConfig.validateManually) {
      next();
      return;
    }

    if (permission.type !== 'basic') {
      throw new Error(
        `Permission '${permissionsConfig.permission}' is not a basic permission and cannot be used in the OpenAPI permissions middleware`,
      );
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

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
  LoggerService,
  PermissionsRegistryService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import {
  AuthorizeResult,
  BasicPermission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import { NotFoundError, NotAllowedError } from '@backstage/errors';

type PermissionsExtension = {
  permission: string;
  validateManually?: boolean;
  resourceRef?: {
    from: 'path' | 'query';
    param: string;
  };
  onDeny?: { statusCode: 403 | 404 } | { statusCode?: number; body: any };
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
  logger: LoggerService;
}) {
  const { permissionsRegistry } = dependencies;
  const registeredPermissions = permissionsRegistry.listPermissions();
  const { permissions: permissionsService, httpAuth, logger } = dependencies;
  return async (
    req: Request & WithOpenapi,
    res: Response,
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

    let resourceRef: string | undefined;
    if (permissionsConfig.resourceRef) {
      if (permission.type !== 'resource') {
        throw new Error(
          `Permission '${permissionsConfig.permission}' is not a resource permission, but resourceRef was specified in the OpenAPI permissions middleware`,
        );
      }
      let value = undefined;
      const param = permissionsConfig.resourceRef.param;
      if (permissionsConfig.resourceRef.from === 'path') {
        // express doesn't attach req.params until the route is matched, but
        // we have the path params available from openapi metadata
        value = req.openapi.pathParams?.[param];
      } else {
        value = req.query?.[param];
      }

      if (!value || typeof value !== 'string') {
        throw new Error(`Resource reference parameter '${param}' not found.`);
      }
      resourceRef = value;
    } else if (permission.type !== 'basic') {
      throw new Error(
        `Permission '${permissionsConfig.permission}' is not a basic permission. Resource permissions require a resourceRef configuration in the OpenAPI permissions middleware`,
      );
    }

    try {
      const authorizeRequest = resourceRef
        ? { permission: permission as ResourcePermission, resourceRef }
        : { permission: permission as BasicPermission };

      const authorizationResponse = (
        await permissionsService.authorize([authorizeRequest], {
          credentials: await httpAuth.credentials(req),
        })
      )[0];

      if (authorizationResponse.result === AuthorizeResult.DENY) {
        const onDeny = permissionsConfig.onDeny ?? { statusCode: 403 };

        if ('body' in onDeny) {
          res.status(onDeny.statusCode ?? 200).json(onDeny.body);
          return;
        }

        if (onDeny.statusCode === 404) {
          throw new NotFoundError();
        }
        throw new NotAllowedError();
      }

      next();
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}

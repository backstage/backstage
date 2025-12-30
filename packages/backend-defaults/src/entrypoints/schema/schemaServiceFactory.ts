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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import type {
  CreateRouterOptions,
  SchemaService,
} from '@backstage/backend-plugin-api';
import {
  createValidatedOpenApiRouterFromGeneratedEndpointMap,
  TypedRouter,
} from '@backstage/backend-openapi-utils';
import type { internal } from '@backstage/backend-openapi-utils';
import type { RequestHandler } from 'express';
import PromiseRouter from 'express-promise-router';
import { OpenAPIObject } from 'openapi3-ts';
import cloneDeep from 'lodash/cloneDeep';

/**
 * OpenAPI schema management for plugins.
 *
 * See {@link @backstage/backend-plugin-api#SchemaService}
 * and {@link https://backstage.io/docs/backend-system/core-services/schema | the service docs}
 * for more information.
 *
 * @public
 */
export const schemaServiceFactory = createServiceFactory({
  service: coreServices.schema,
  deps: {
    plugin: coreServices.pluginMetadata,
    config: coreServices.rootConfig,
    logger: coreServices.logger,
    auditor: coreServices.auditor,
    permissions: coreServices.permissions,
    httpAuth: coreServices.httpAuth,
  },
  async factory({
    plugin,
    config,
    logger,
    auditor: _auditor,
    permissions: _permissions,
    httpAuth: _httpAuth,
  }): Promise<SchemaService> {
    const pluginId = plugin.getId();
    let schema: unknown | undefined = undefined;

    // Read plugin-specific config
    const schemaConfig = config.getOptionalConfig(`backend.schema.${pluginId}`);
    const auditEnabled =
      schemaConfig?.getOptionalBoolean('audit.enabled') ?? false;
    const permissionsEnabled =
      schemaConfig?.getOptionalBoolean('permissions.enabled') ?? false;
    const validationEnabled =
      schemaConfig?.getOptionalBoolean('validation.enabled') ?? true;

    logger.info(
      `Schema service initialized for ${pluginId}: audit=${auditEnabled}, permissions=${permissionsEnabled}, validation=${validationEnabled}`,
    );

    return {
      register(spec: unknown): void {
        logger.info(`Registering OpenAPI schema for plugin ${pluginId}`);

        schema = cloneDeep(spec) as OpenAPIObject;
      },

      async createRouter<T extends internal.EndpointMap>(
        options?: CreateRouterOptions,
      ): Promise<TypedRouter<T>> {
        if (!schema) {
          throw new Error(
            `No schemas registered for plugin ${pluginId}. Call register() before createRouter().`,
          );
        }

        const middleware: RequestHandler[] = [];

        // TODO: Pre-route middleware for audit event creation
        // if (auditEnabled) {
        //   middleware.push((req, _res, next) => {
        //     console.log("Audit middleware - to be implemented");
        //     next();
        //   });
        // }

        // TODO: Pre-route permissions middleware
        // if (permissionsEnabled) {
        //   middleware.push(createPermissionsMiddleware({ permissions: _permissions, httpAuth: _httpAuth }));
        // }

        logger.debug(
          `Creating router for ${pluginId} with audit=${auditEnabled}, permissions=${permissionsEnabled}`,
        );

        // Create outer router with validation
        const router = createValidatedOpenApiRouterFromGeneratedEndpointMap<T>(
          schema as OpenAPIObject,
          {
            middleware,
            validatorOptions: {
              ...options?.validatorOptions,
            },
          },
        );

        // Create inner router for plugin routes
        const pluginRoutes = PromiseRouter();
        router.use(pluginRoutes);

        // TODO: Post-route audit error handler.

        // Return the inner router for plugins to add routes to
        return pluginRoutes as typeof router;
      },
    };
  },
});

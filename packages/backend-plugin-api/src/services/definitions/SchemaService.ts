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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { TypedRouter } from '../../../../backend-openapi-utils/src/router';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { EndpointMap } from '../../../../backend-openapi-utils/src/types';

/**
 * Options for creating an OpenAPI router.
 *
 * @public
 */
export interface CreateRouterOptions {
  /**
   * OpenAPI validator options.
   *
   * @see https://github.com/cdimascio/express-openapi-validator
   */
  validatorOptions?: {
    /**
     * Paths to ignore during validation.
     */
    ignorePaths?: RegExp;
  };
}

/**
 * Manages OpenAPI schemas for plugins.
 *
 * This service provides schema registration and type-safe router creation
 * with automatic integration of auditing, permissions, and validation middleware
 * based on configuration.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/schema | service documentation} for more details.
 *
 * @public
 */
export interface SchemaService {
  /**
   * Registers an OpenAPI schema for the plugin.
   *
   * @remarks
   *
   * Multiple schemas can be registered with different moduleIds to create
   * separate typed routers. Each registered schema maintains its own type
   * information for router creation.
   *
   * Middleware integration (audit, permissions, validation) is controlled
   * by configuration in app-config.yaml under `backend.schema.<pluginId>`.
   *
   * @example
   *
   * Configuration:
   * ```yaml
   * backend:
   *   schema:
   *     catalog:  # Plugin ID
   *       audit:
   *         enabled: true
   *       permissions:
   *         enabled: true
   *       validation:
   *         enabled: true
   * ```
   *
   * Plugin code:
   * ```ts
   * const spec = require('./openapi.yaml');
   * schema.register(spec, {
   *   moduleId: 'core',
   *   validatorOptions: {
   *     ignorePaths: /^\/validate-entity\/?$/,
   *   },
   * });
   * ```
   *
   * @param spec - The OpenAPI specification to register
   * @param options - Registration options
   */
  register(spec: unknown): void;

  /**
   * Creates a type-safe Express router from a registered schema.
   *
   * @remarks
   *
   * The router is automatically configured with:
   * - Request/response validation based on the OpenAPI spec
   * - Audit middleware (if enabled in config)
   * - Permissions middleware (if enabled in config)
   * - OpenAPI spec endpoint at `/.well-known/backstage/openapi.json`
   *
   * @example
   *
   * ```ts
   * // Single schema
   * const router = await schema.createRouter();
   * httpRouter.use(router);
   *
   * // Multiple modules
   * const routerA = await schema.createRouter({ moduleId: 'moduleA' });
   * const routerB = await schema.createRouter({ moduleId: 'moduleB' });
   * httpRouter.use('/moduleA', routerA);
   * httpRouter.use('/moduleB', routerB);
   * ```
   *
   * @param options - Router creation options
   * @returns A configured Express router
   */
  createRouter<T extends EndpointMap>(
    options?: CreateRouterOptions,
  ): Promise<TypedRouter<T>>;
}

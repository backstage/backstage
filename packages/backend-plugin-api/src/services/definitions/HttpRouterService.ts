/*
 * Copyright 2022 The Backstage Authors
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

import type { Handler } from 'express';

/**
 * Options for {@link HttpRouterService.addAuthPolicy}.
 *
 * @public
 */
export interface HttpRouterServiceAuthPolicy {
  path: string;
  allow: 'unauthenticated' | 'user-cookie';
}

/**
 * Allows plugins to register HTTP routes.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/http-router | service documentation} for more details.
 *
 * @public
 */
export interface HttpRouterService {
  /**
   * Registers an Express request handler under the plugin's base router. This
   * typically makes its base path `/api/<plugin-id>`.
   */
  use(handler: Handler): void;

  /**
   * Adds an auth policy to the router. This is used to allow unauthenticated or
   * cookie based access to parts of a plugin's API.
   *
   * @remarks
   *
   * The paths given follow the same pattern as the routers given to the `use`
   * method, that is, they are relative to the plugin's base URL, and can
   * contain placeholders.
   *
   * @example
   *
   * ```ts
   * http.addAuthPolicy({
   *   path: '/static/:id',
   *   allow: 'user-cookie',
   * });
   * ```
   *
   * This allows limited access tokens via cookies on the
   * `/api/<plugin-id>/static/*` paths, but not unauthenticated access.
   */
  addAuthPolicy(policy: HttpRouterServiceAuthPolicy): void;
}

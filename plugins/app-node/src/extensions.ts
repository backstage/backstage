/*
 * Copyright 2023 The Backstage Authors
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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { ConfigSchema } from '@backstage/config-loader';
import { Handler } from 'express';

/**
 * The interface for {@link staticFallbackHandlerExtensionPoint}.
 *
 * @public
 */
export interface StaticFallbackHandlerExtensionPoint {
  /**
   * Sets the static fallback handler. This can only be done once.
   */
  setStaticFallbackHandler(handler: Handler): void;
}

/**
 * An extension point the exposes the ability to configure a static fallback handler for the app backend.
 *
 * The static fallback handler is a request handler to handle requests for static content that is not
 * present in the app bundle.
 *
 * This can be used to avoid issues with clients on older deployment versions trying to access lazy
 * loaded content that is no longer present. Typically the requests would fall back to a long-term
 * object store where all recently deployed versions of the app are present.
 *
 * Another option is to provide a `database` that will take care of storing the static assets instead.
 *
 * If both `database` and `staticFallbackHandler` are provided, the `database` will attempt to serve
 * static assets first, and if they are not found, the `staticFallbackHandler` will be called.
 *
 * @public
 */
export const staticFallbackHandlerExtensionPoint =
  createExtensionPoint<StaticFallbackHandlerExtensionPoint>({
    id: 'app.staticFallbackHandler',
  });

/**
 * The interface for {@link configSchemaExtensionPoint}.
 *
 * @public
 */
export interface ConfigSchemaExtensionPoint {
  /**
   * Sets the config schema. This can only be done once.
   */
  setConfigSchema(configSchema: ConfigSchema): void;
}

/**
 * An extension point the exposes the ability to override the config schema used by the frontend application.
 *
 * @public
 */
export const configSchemaExtensionPoint =
  createExtensionPoint<ConfigSchemaExtensionPoint>({
    id: 'app.configSchema',
  });

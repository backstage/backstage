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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  readHttpServerOptions as _readHttpServerOptions,
  createHttpServer as _createHttpServer,
  MiddlewareFactory as _MiddlewareFactory,
  readCorsOptions as _readCorsOptions,
  readHelmetOptions as _readHelmetOptions,
  type MiddlewareFactoryErrorOptions as _MiddlewareFactoryErrorOptions,
  type MiddlewareFactoryOptions as _MiddlewareFactoryOptions,
  type ExtendedHttpServer as _ExtendedHttpServer,
  type HttpServerCertificateOptions as _HttpServerCertificateOptions,
  type HttpServerOptions as _HttpServerOptions,
} from '../../../backend-defaults/src/entrypoints/rootHttpRouter/http';

/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export const readHttpServerOptions = _readHttpServerOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export const createHttpServer = _createHttpServer;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export const readCorsOptions = _readCorsOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export const readHelmetOptions = _readHelmetOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export const MiddlewareFactory = _MiddlewareFactory;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type MiddlewareFactoryErrorOptions = _MiddlewareFactoryErrorOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type MiddlewareFactoryOptions = _MiddlewareFactoryOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type ExtendedHttpServer = _ExtendedHttpServer;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type HttpServerCertificateOptions = _HttpServerCertificateOptions;
/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootHttpRouter` instead.
 */
export type HttpServerOptions = _HttpServerOptions;

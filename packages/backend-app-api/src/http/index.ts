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

import { ErrorRequestHandler, RequestHandler } from 'express';
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
export class MiddlewareFactory {
  /**
   * Creates a new {@link MiddlewareFactory}.
   */
  static create(options: MiddlewareFactoryOptions) {
    return new MiddlewareFactory(_MiddlewareFactory.create(options));
  }

  private constructor(private readonly impl: _MiddlewareFactory) {}

  /**
   * Returns a middleware that unconditionally produces a 404 error response.
   *
   * @remarks
   *
   * Typically you want to place this middleware at the end of the chain, such
   * that it's the last one attempted after no other routes matched.
   *
   * @returns An Express request handler
   */
  notFound(): RequestHandler {
    return this.impl.notFound();
  }

  /**
   * Returns the compression middleware.
   *
   * @remarks
   *
   * The middleware will attempt to compress response bodies for all requests
   * that traverse through the middleware.
   */
  compression(): RequestHandler {
    return this.impl.compression();
  }

  /**
   * Returns a request logging middleware.
   *
   * @remarks
   *
   * Typically you want to place this middleware at the start of the chain, such
   * that it always logs requests whether they are "caught" by handlers farther
   * down or not.
   *
   * @returns An Express request handler
   */
  logging(): RequestHandler {
    return this.impl.logging();
  }

  /**
   * Returns a middleware that implements the helmet library.
   *
   * @remarks
   *
   * This middleware applies security policies to incoming requests and outgoing
   * responses. It is configured using config keys such as `backend.csp`.
   *
   * @see {@link https://helmetjs.github.io/}
   *
   * @returns An Express request handler
   */
  helmet(): RequestHandler {
    return this.impl.helmet();
  }

  /**
   * Returns a middleware that implements the cors library.
   *
   * @remarks
   *
   * This middleware handles CORS. It is configured using the config key
   * `backend.cors`.
   *
   * @see {@link https://github.com/expressjs/cors}
   *
   * @returns An Express request handler
   */
  cors(): RequestHandler {
    return this.impl.cors();
  }

  /**
   * Express middleware to handle errors during request processing.
   *
   * @remarks
   *
   * This is commonly the very last middleware in the chain.
   *
   * Its primary purpose is not to do translation of business logic exceptions,
   * but rather to be a global catch-all for uncaught "fatal" errors that are
   * expected to result in a 500 error. However, it also does handle some common
   * error types (such as http-error exceptions, and the well-known error types
   * in the `@backstage/errors` package) and returns the enclosed status code
   * accordingly.
   *
   * It will also produce a response body with a serialized form of the error,
   * unless a previous handler already did send a body. See
   * {@link @backstage/errors#ErrorResponseBody} for the response shape used.
   *
   * @returns An Express error request handler
   */
  error(options: MiddlewareFactoryErrorOptions = {}): ErrorRequestHandler {
    return this.impl.error(options);
  }
}
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

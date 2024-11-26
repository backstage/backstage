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

import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { readHelmetOptions } from './readHelmetOptions';
import { readCorsOptions } from './readCorsOptions';
import {
  AuthenticationError,
  ConflictError,
  ErrorResponseBody,
  InputError,
  NotAllowedError,
  NotFoundError,
  NotImplementedError,
  NotModifiedError,
  serializeError,
  ServiceUnavailableError,
} from '@backstage/errors';
import { applyInternalErrorFilter } from './applyInternalErrorFilter';
import { rateLimit } from 'express-rate-limit';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { RateLimitStoreFactory } from './RateLimitStoreFactory';

type LogMeta = {
  date: string;
  method: string;
  url: string;
  status: number;
  httpVersion: string;
  userAgent?: string;
  contentLength?: number;
  referrer?: string;
};

function getLogMeta(req: Request, res: Response): LogMeta {
  const referrer = req.headers.referer ?? req.headers.referrer;
  const userAgent = req.headers['user-agent'];
  const contentLength = Number(res.getHeader('content-length'));

  const meta: LogMeta = {
    date: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl ?? req.url,
    status: res.statusCode,
    httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
  };

  if (userAgent) {
    meta.userAgent = userAgent;
  }

  if (isFinite(contentLength)) {
    meta.contentLength = contentLength;
  }

  if (referrer) {
    meta.referrer = Array.isArray(referrer) ? referrer.join(', ') : referrer;
  }

  return meta;
}

/**
 * Options used to create a {@link MiddlewareFactory}.
 *
 * @public
 */
export interface MiddlewareFactoryOptions {
  config: RootConfigService;
  logger: LoggerService;
}

/**
 * Options passed to the {@link MiddlewareFactory.error} middleware.
 *
 * @public
 */
export interface MiddlewareFactoryErrorOptions {
  /**
   * Whether error response bodies should show error stack traces or not.
   *
   * If not specified, by default shows stack traces only in development mode.
   */
  showStackTraces?: boolean;

  /**
   * Whether any 4xx errors should be logged or not.
   *
   * If not specified, default to only logging 5xx errors.
   */
  logAllErrors?: boolean;
}

/**
 * A utility to configure common middleware.
 *
 * @public
 */
export class MiddlewareFactory {
  #config: RootConfigService;
  #logger: LoggerService;

  /**
   * Creates a new {@link MiddlewareFactory}.
   */
  static create(options: MiddlewareFactoryOptions) {
    return new MiddlewareFactory(options);
  }

  private constructor(options: MiddlewareFactoryOptions) {
    this.#config = options.config;
    this.#logger = options.logger;
  }

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
    return (_req: Request, res: Response) => {
      res.status(404).end();
    };
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
    return compression();
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
    const logger = this.#logger;
    return (req: Request, res: Response, next: NextFunction) => {
      res.on('finish', () => {
        const meta = getLogMeta(req, res);
        logger.info(
          `[${meta.date}] "${meta.method} ${meta.url} HTTP/${
            meta.httpVersion
          }" ${meta.status} ${meta.contentLength ?? 0} "${
            meta.referrer ?? '-'
          }" "${meta.userAgent ?? '-'}"`,
          {
            type: 'incomingRequest',
            ...meta,
          },
        );
      });
      next();
    };
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
    return helmet(readHelmetOptions(this.#config.getOptionalConfig('backend')));
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
    return cors(readCorsOptions(this.#config.getOptionalConfig('backend')));
  }

  /**
   * Returns a middleware that implements rate limiting.
   *
   * @remarks
   *
   * Rate limiting is a common technique to prevent abuse of APIs. This middleware is
   * configured using the config key `backend.rateLimit`.
   *
   * @returns An Express request handler
   */
  rateLimit(): RequestHandler {
    const enabled = this.#config.has('backend.rateLimit');
    if (!enabled) {
      return (_req: Request, _res: Response, next: NextFunction) => {
        next();
      };
    }

    const useDefaults = this.#config.getOptional('backend.rateLimit');
    const rateLimitOptions =
      useDefaults === true
        ? undefined
        : this.#config.getOptionalConfig('backend.rateLimit');

    let windowMs: number = 60000;
    if (rateLimitOptions && rateLimitOptions.has('window')) {
      const windowDuration = readDurationFromConfig(rateLimitOptions, {
        key: 'window',
      });
      windowMs = durationToMilliseconds(windowDuration);
    }

    const ipAllowList = rateLimitOptions?.getOptionalStringArray(
      'ipAllowList',
    ) ?? ['127.0.0.1', '0:0:0:0:0:0:0:1', '::1'];

    return rateLimit({
      windowMs,
      limit: rateLimitOptions?.getOptionalNumber('incomingRequestLimit'),
      skipSuccessfulRequests: rateLimitOptions?.getOptionalBoolean(
        'skipSuccessfulRequests',
      ),
      skipFailedRequests:
        rateLimitOptions?.getOptionalBoolean('skipFailedRequests'),
      passOnStoreError:
        rateLimitOptions?.getOptionalBoolean('passOnStoreError'),
      keyGenerator(req, _res): string {
        if (!req.ip) {
          return req.socket.remoteAddress!;
        }
        return req.ip;
      },
      skip: (req, _res) => {
        return (
          Boolean(req.ip && ipAllowList.includes(req.ip)) ||
          Boolean(
            req.socket.remoteAddress &&
              ipAllowList.includes(req.socket.remoteAddress),
          )
        );
      },
      validate: {
        trustProxy: false,
      },
      store: useDefaults
        ? undefined
        : new RateLimitStoreFactory(this.#config).create(),
    });
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
    const showStackTraces =
      options.showStackTraces ?? process.env.NODE_ENV === 'development';

    const logger = this.#logger.child({
      type: 'errorHandler',
    });

    return (
      rawError: Error,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const error = applyInternalErrorFilter(rawError, logger);

      const statusCode = getStatusCode(error);
      if (options.logAllErrors || statusCode >= 500) {
        logger.error(`Request failed with status ${statusCode}`, error);
      }

      if (res.headersSent) {
        // If the headers have already been sent, do not send the response again
        // as this will throw an error in the backend.
        next(error);
        return;
      }

      const body: ErrorResponseBody = {
        error: serializeError(error, { includeStack: showStackTraces }),
        request: { method: req.method, url: req.url },
        response: { statusCode },
      };

      res.status(statusCode).json(body);
    };
  }
}

function getStatusCode(error: Error): number {
  // Look for common http library status codes
  const knownStatusCodeFields = ['statusCode', 'status'];
  for (const field of knownStatusCodeFields) {
    const statusCode = (error as any)[field];
    if (
      typeof statusCode === 'number' &&
      (statusCode | 0) === statusCode && // is whole integer
      statusCode >= 100 &&
      statusCode <= 599
    ) {
      return statusCode;
    }
  }

  // Handle well-known error types
  switch (error.name) {
    case NotModifiedError.name:
      return 304;
    case InputError.name:
      return 400;
    case AuthenticationError.name:
      return 401;
    case NotAllowedError.name:
      return 403;
    case NotFoundError.name:
      return 404;
    case ConflictError.name:
      return 409;
    case NotImplementedError.name:
      return 501;
    case ServiceUnavailableError.name:
      return 503;
    default:
      break;
  }

  // Fall back to internal server error
  return 500;
}

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
  AuditorService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type { JsonObject, JsonValue } from '@backstage/types';
import { ForwardedError } from '@backstage/errors';

type AuditorExtension = {
  eventId: string;
  severityLevel?: 'low' | 'medium' | 'high' | 'critical';
  meta?: JsonObject;
  captureMetaFromRequest?: {
    body?: string[];
    params?: string[];
    query?: string[];
  };
  captureMetaFromResponse?: {
    body?: string[];
  };
};

function extractValueFromObject(
  obj: JsonValue,
  path: string,
): JsonValue | undefined {
  const parts = path.split('.');
  let current: JsonValue | undefined = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as JsonObject)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function waitForResponseToFinish(res: Response): Promise<void> {
  return new Promise(resolve => {
    res.on('finish', () => resolve());
  });
}

/** @internal */
export interface WithOpenapi {
  openapi?: {
    expressRoute: string;
    openApiRoute: string;
    pathParams: Record<string, string>;
    schema: OperationObject; // This is the operation schema for the matched route
    serial: number;
  };
}

const AUDITOR_SYMBOL = Symbol('auditor');

/** @internal */
export interface WithAuditorEvent {
  [AUDITOR_SYMBOL]?: Awaited<ReturnType<AuditorService['createEvent']>>;
}

const CAPTURED_RESPONSE_BODY_SYMBOL = Symbol('capturedResponseBody');

interface WithCapturedResponseBody {
  [CAPTURED_RESPONSE_BODY_SYMBOL]?: JsonObject;
}

const VARIANT_LOOKUP: Record<string, string> = {
  GET: 'fetch',
  POST: 'create',
  PATCH: 'update',
  PUT: 'update',
  DELETE: 'delete',
};

/**
 *
 * Middleware factory for auditing OpenAPI requests and responses.
 *
 * @public
 */
export function auditorMiddlewareFactory(dependencies: {
  auditor: AuditorService;
  logger: LoggerService;
}) {
  const { auditor, logger } = dependencies;

  function baseHandler(
    req: Request & WithOpenapi,
    res: Response,
  ):
    | {
        captureRequestMetadata: () => JsonObject;
        captureResponseMetadata: () => JsonObject;
        auditorConfig: AuditorExtension;
      }
    | undefined {
    if (!req.openapi) {
      return undefined;
    }
    const operation = req.openapi.schema; // schema is actually the operation object
    if (!operation) {
      logger.debug('No operation schema found in request.openapi');
      return undefined;
    }

    // Check for x-backstage-auditor extension
    const auditorConfig = operation['x-backstage-auditor'] as
      | AuditorExtension
      | undefined;

    if (!auditorConfig) {
      logger.debug('No x-backstage-auditor extension found');
      return undefined;
    }

    // Store the capture config for use in finish event
    const {
      captureMetaFromRequest,
      captureMetaFromResponse,
      meta: staticMeta = {},
    } = auditorConfig;

    // Capture metadata from request
    const captureRequestMetadata = (): JsonObject => {
      const meta: JsonObject = {
        route: req.openapi?.expressRoute,
        ...staticMeta,
      };
      const variant = VARIANT_LOOKUP[req.method];
      if (variant) {
        meta.variant = variant;
      }

      if (captureMetaFromRequest) {
        const { body, params, query } = captureMetaFromRequest;

        if (body) {
          for (const field of body) {
            const value = extractValueFromObject(req.body, field);
            if (value !== undefined) {
              meta[field] = value;
            }
          }
        }

        if (params) {
          for (const field of params) {
            // Use pathParams from openapi, fallback to req.params
            const value = req.openapi?.pathParams[field] ?? req.params[field];
            if (value !== undefined) {
              meta[field] = value;
            }
          }
        }

        if (query) {
          for (const field of query) {
            const value = req.query[field];
            if (value !== undefined) {
              meta[field] = value;
            }
          }
        }
      }

      return meta;
    };

    const captureResponseMetadata = (): JsonObject => {
      const meta: JsonObject = {};
      if (captureMetaFromResponse) {
        const { body } = captureMetaFromResponse;

        if (body) {
          // Access captured response body from res.locals
          const locals = res.locals as Response['locals'] &
            WithCapturedResponseBody;
          const responseBody = locals[CAPTURED_RESPONSE_BODY_SYMBOL];
          if (responseBody) {
            for (const field of body) {
              const value = extractValueFromObject(responseBody, field);
              if (value !== undefined) {
                meta[field] = value;
              }
            }
          }
        }
      }
      return meta;
    };

    return { captureRequestMetadata, captureResponseMetadata, auditorConfig };
  }

  const success = async (_req: Request, res: Response, next: NextFunction) => {
    // Hide request object types from the public API.
    const req = _req as Request & WithOpenapi & WithAuditorEvent;
    const result = baseHandler(req, res);
    if (!result) {
      next();
      return;
    }
    const { captureRequestMetadata, captureResponseMetadata, auditorConfig } =
      result;

    // Intercept response body if we need to capture from it
    const captureMetaFromResponse = auditorConfig.captureMetaFromResponse;
    if (captureMetaFromResponse?.body) {
      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);

      const locals = res.locals as Response['locals'] &
        WithCapturedResponseBody;
      res.json = function overriddenJson(body: JsonObject) {
        locals[CAPTURED_RESPONSE_BODY_SYMBOL] = body;
        return originalJson(body);
      };

      res.send = function overriddenSend(body: JsonValue) {
        if (body && typeof body === 'object' && !Array.isArray(body)) {
          locals[CAPTURED_RESPONSE_BODY_SYMBOL] = body;
        } else {
          logger.debug(`Response body is not an object. Not capturing fields.`);
        }
        return originalSend(body);
      };
    }

    try {
      const auditorEvent = await auditor.createEvent({
        eventId: auditorConfig.eventId,
        severityLevel: auditorConfig.severityLevel,
        meta: captureRequestMetadata(),
        request: req,
      });
      req[AUDITOR_SYMBOL] = auditorEvent;
    } catch (err) {
      logger.error(`Failed to create auditor event: ${err}`);
      next();
      return;
    }

    const responseFinished = waitForResponseToFinish(res);

    // Yield to next middleware / route handler
    next();

    // Wait for response to finish (res.send/res.json)
    await responseFinished;

    if (!req[AUDITOR_SYMBOL]) {
      return;
    }

    const auditorEvent = req[AUDITOR_SYMBOL];

    // Create audit event after response finishes so captureMetadata can access response body
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await auditorEvent.success({ meta: captureResponseMetadata() });
      } else {
        await auditorEvent.fail({
          error: new Error(
            `Response returned with status code ${res.statusCode}`,
          ),
          meta: captureResponseMetadata(),
        });
      }
      delete req[AUDITOR_SYMBOL];
    } catch (err) {
      logger.error(`Failed to finalize auditor event`, err);
      // Don't fail the request if auditing fails after the response is sent.
      return;
    }
  };

  const error = async (
    err: Error,
    _req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    // Hide request object types from the public API.
    const req = _req as Request & WithOpenapi & WithAuditorEvent;
    if (!req[AUDITOR_SYMBOL]) {
      next(err);
      return;
    }
    const result = baseHandler(req, _res);
    if (!result) {
      next(err);
      return;
    }
    const { captureResponseMetadata } = result;
    // Create audit event - capture metadata after route matching
    try {
      await req[AUDITOR_SYMBOL].fail({
        error: err,
        meta: captureResponseMetadata(),
      });
      delete req[AUDITOR_SYMBOL];
    } catch {
      next(new ForwardedError('Auditor middleware failed', err));
      return;
    }

    next(err);
  };

  return { success, error };
}

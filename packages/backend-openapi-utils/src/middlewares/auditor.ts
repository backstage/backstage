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
import type { JsonObject, JsonPrimitive, JsonValue } from '@backstage/types';
import { ForwardedError } from '@backstage/errors';
import { createPatternResolver } from '../util/createPatternResolver';

type AuditorExtension = {
  eventId: string;
  severityLevel?: 'low' | 'medium' | 'high' | 'critical';
  meta?: Record<string, string>;
};

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
        captureRequestMetadata: () => JsonObject | undefined;
        captureResponseMetadata: () => JsonObject | undefined;
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

    const { meta: metaPatterns = {} } = auditorConfig;

    // Create pattern resolvers for each meta field
    // We need to distinguish between static strings and patterns
    const requestPatternResolvers = new Map<
      string,
      | { type: 'static'; value: string }
      | {
          type: 'pattern';
          resolver: <T extends object>(context: T) => JsonPrimitive;
        }
    >();

    const responsePatternResolvers = new Map<
      string,
      | { type: 'static'; value: string }
      | {
          type: 'pattern';
          resolver: <T extends object>(context: T) => JsonPrimitive;
        }
    >();

    for (const [key, pattern] of Object.entries(metaPatterns)) {
      // Check if pattern contains placeholders
      if (pattern.includes('{{')) {
        const usesRequest = pattern.includes('{{ request.');
        const usesResponse = pattern.includes('{{ response.');
        if (usesRequest && usesResponse) {
          throw new Error(
            'Pattern cannot contain both request and response placeholders',
          );
        }
        const patternResolver = {
          type: 'pattern',
          resolver: createPatternResolver(pattern),
        } as const;
        if (usesRequest) {
          requestPatternResolvers.set(key, patternResolver);
        } else if (usesResponse) {
          responsePatternResolvers.set(key, patternResolver);
        }
      } else {
        // Static value - no pattern to resolve
        // Only attach this to the request pattern resolvers so it's rendered in the initial
        //  audit event.
        requestPatternResolvers.set(key, { type: 'static', value: pattern });
      }
    }

    // Capture metadata from request
    const captureRequestMetadata = (): JsonObject | undefined => {
      const variant = VARIANT_LOOKUP[req.method];
      const meta: JsonObject = {
        route: req.openapi?.expressRoute,
        ...(variant ? { variant } : {}),
      };

      // Resolve patterns with request context
      const context = {
        request: {
          body: req.body,
          params: req.openapi?.pathParams ?? req.params,
          query: req.query,
        },
      };

      for (const [key, resolver] of requestPatternResolvers) {
        try {
          if (resolver.type === 'static') {
            meta[key] = resolver.value;
          } else {
            const value = resolver.resolver(context);
            if (value !== undefined) {
              meta[key] = value;
            }
          }
        } catch (err) {
          // Pattern could not be resolved (e.g., references response which is not available yet)
          // or the value is not available in the request. Skip it for now.
          logger.debug(`Could not resolve pattern for key '${key}': ${err}`);
        }
      }

      return Object.keys(meta).length > 0 ? meta : undefined;
    };

    const captureResponseMetadata = (): JsonObject | undefined => {
      const meta: JsonObject = {};

      // Access captured response body from res.locals
      const locals = res.locals as Response['locals'] &
        WithCapturedResponseBody;
      const responseBody = locals[CAPTURED_RESPONSE_BODY_SYMBOL];

      const context = {
        response: {
          body: responseBody,
        },
      };

      // Resolve patterns with response context
      for (const [key, resolver] of responsePatternResolvers) {
        try {
          if (resolver.type === 'static') {
            meta[key] = resolver.value;
          } else {
            const value = resolver.resolver(context);
            if (value !== undefined) {
              meta[key] = value;
            }
          }
        } catch (err) {
          // Pattern could not be resolved, skip it
          logger.debug(
            `Could not resolve pattern for key '${key}' with response: ${err}`,
          );
        }
      }

      return Object.keys(meta).length > 0 ? meta : undefined;
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

    // Intercept response body if any pattern references response.body
    const needsResponseBody = Object.values(auditorConfig.meta ?? {}).some(
      pattern => pattern.includes('{{ response.body'),
    );
    if (needsResponseBody) {
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

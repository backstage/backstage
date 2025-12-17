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
import {
  OpenAPIObject,
  PathItemObject,
  OperationObject,
} from 'openapi3-ts';
import type { AuditorService } from '@backstage/backend-plugin-api';
import type { JsonObject } from '@backstage/types';

type AuditorExtension = {
  eventId: string;
  severityLevel?: 'low' | 'medium' | 'high' | 'critical';
  meta?: JsonObject & {
    captureFromRequest?: {
      body?: string[];
      params?: string[];
      query?: string[];
    };
    captureFromResponse?: {
      body?: string[];
    };
  };
};

type PathMatcher = {
  regex: RegExp;
  path: string;
  pathItem: PathItemObject;
};

function convertPathToRegex(path: string): RegExp {
  // Convert OpenAPI path like /users/{id} to regex
  const regexStr = path
    .replace(/\{[^}]+\}/g, '([^/]+)') // Replace {param} with capture group
    .replace(/\//g, '\\/'); // Escape slashes
  return new RegExp(`^${regexStr}$`);
}

function extractValueFromObject(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

export function auditorMiddlewareFactory(
  apiSpec: OpenAPIObject,
  auditor: AuditorService,
) {
  // Pre-compile path matchers for efficiency
  const pathMatchers: PathMatcher[] = [];
  for (const [path, pathItem] of Object.entries(apiSpec.paths || {})) {
    if (pathItem) {
      pathMatchers.push({
        regex: convertPathToRegex(path),
        path,
        pathItem,
      });
    }
  }

  function baseHandler(req: Request, res: Response): {
    captureMetadata: () => JsonObject;
    auditorConfig: AuditorExtension;
  } | undefined {
    // Find matching path
    const requestPath = req.path;
    const matcher = pathMatchers.find(m => m.regex.test(requestPath));

    if (!matcher) {
      return undefined;
    }

    // Get operation for the HTTP method
    const method = req.method.toLowerCase();
    const operation = matcher.pathItem[
      method as keyof PathItemObject
    ] as OperationObject;

    if (!operation) {
      return undefined;
    }

    // Check for x-backstage-auditor extension
    const auditorConfig = operation['x-backstage-auditor'] as
      | AuditorExtension
      | undefined;

    if (!auditorConfig) {
      return undefined;
    }

    // Store the capture config for use in finish event
    const { captureFromRequest, captureFromResponse, ...staticMeta } =
      auditorConfig.meta || {};

    // Capture metadata from request - some may not be available yet (params)
    const captureMetadata = (): JsonObject => {
      const meta: JsonObject = { ...staticMeta };

      if (captureFromRequest) {
        const { body, params, query } = captureFromRequest;

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
            const value = req.params[field];
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

    return {captureMetadata, auditorConfig};
  }

  const success = (req: Request, res: Response, next: NextFunction) => {
    const result = baseHandler(req, res);
    if (!result) {
      next();
      return;
    }
    const { captureMetadata, auditorConfig } = result;

    res.on('finish', () => {
      if(res.statusCode >= 200 && res.statusCode < 300) {
        // Create audit event - capture metadata after route matching
        auditor
          .createEvent({
            eventId: auditorConfig.eventId,
            severityLevel: auditorConfig.severityLevel,
            meta: captureMetadata(),
            request: req,
          })
          .then(auditorEvent => {
            // Only mark as success for 2xx responses
            // For errors, the handler should catch and call auditorEvent.fail()
            if (res.statusCode >= 200 && res.statusCode < 300) {
              auditorEvent.success().catch(() => {});
            }
          })
          .catch(() => {
            // If audit event creation fails, don't block the request
          });
      }
    });

    next();
  };

  const error = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const result = baseHandler(req, res);
    if (!result) {
      next(err);
      return;
    }
    const { captureMetadata, auditorConfig } = result;
    // Create audit event - capture metadata after route matching
    auditor
      .createEvent({
        eventId: auditorConfig.eventId,
        severityLevel: auditorConfig.severityLevel,
        meta: captureMetadata(),
        request: req,
      })
      .then(auditorEvent => {
        auditorEvent.fail({error: err}).catch(() => {})
      })
      .catch(() => {
        // If audit event creation fails, don't block the request
      });

    next(err);
  };

  return { success, error };
}
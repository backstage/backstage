/*
 * Copyright 2021 The Backstage Authors
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

import { useHotCleanup } from '@backstage/backend-common';
import { RequestHandler, Request } from 'express';
import promBundle from 'express-prom-bundle';
import prom from 'prom-client';
import * as url from 'url';

/**
 * Experimental Prometheus metrics used to benchmark the performance of the
 * software catalog. Use this at your own risk.
 */
const rootRegEx = new RegExp('^/([^/]*)/.*');
const apiRegEx = new RegExp('^/api/([^/]*)/.*');

function normalizePath(req: Request): string {
  const path = url.parse(req.originalUrl || req.url).pathname || '/';

  // Capture /api/ and the plugin name
  if (apiRegEx.test(path)) {
    return path.replace(apiRegEx, '/api/$1');
  }

  // Only the first path segment at root level
  return path.replace(rootRegEx, '/$1');
}

export function metricsInit(): void {
  prom.collectDefaultMetrics({ prefix: 'backstage_' });
}

/**
 * Adds a /metrics endpoint, register default runtime metrics and instrument the router.
 */
export function metricsHandler(): RequestHandler {
  // We can only initialize the metrics once and have to clean them up between hot reloads
  useHotCleanup(module, () => prom.register.clear());

  return promBundle({
    includeMethod: true,
    includePath: true,
    // Using includePath alone is problematic, as it will include path labels with high
    // cardinality (e.g. path params). Instead we would have to template them. However, this
    // is difficult, as every backend plugin might use different routes. Instead we only take
    // the first directory of the path, to have at least an idea how each plugin performs:
    normalizePath,
    promClient: { collectDefaultMetrics: {} },
  });
}

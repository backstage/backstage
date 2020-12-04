---
'@backstage/backend-common': minor
---

Removes the Prometheus integration from `backend-common`.

Rational behind this change is to keep the metrics integration of Backstage
generic. Instead of directly relying on Prometheus, Backstage will expose
metrics in a generic way. Integrators can then export the metrics in their
desired format. For example using Prometheus.

To keep the existing behavior, you need to integrate Prometheus in your
backend:

First, add a dependency on `express-prom-bundle` and `prom-client` to your backend.

```diff
// packages/backend/package.json
  "dependencies": {
+   "express-prom-bundle": "^6.1.0",
+   "prom-client": "^12.0.0",
```

Then, add a handler for metrics and a simple instrumentation for the endpoints.

```typescript
// packages/backend/src/metrics.ts
import { useHotCleanup } from '@backstage/backend-common';
import { RequestHandler } from 'express';
import promBundle from 'express-prom-bundle';
import prom from 'prom-client';
import * as url from 'url';

const rootRegEx = new RegExp('^/([^/]*)/.*');
const apiRegEx = new RegExp('^/api/([^/]*)/.*');

export function normalizePath(req: any): string {
  const path = url.parse(req.originalUrl || req.url).pathname || '/';

  // Capture /api/ and the plugin name
  if (apiRegEx.test(path)) {
    return path.replace(apiRegEx, '/api/$1');
  }

  // Only the first path segment at root level
  return path.replace(rootRegEx, '/$1');
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
```

Last, extend your router configuration with the `metricsHandler`:

```diff
+import { metricsHandler } from './metrics';

...

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
+   .addRouter('', metricsHandler())
    .addRouter('/api', apiRouter);
```

Your Prometheus metrics will be available at the `/metrics` endpoint.

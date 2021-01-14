# @backstage/backend-common

## 0.4.3

### Patch Changes

- Updated dependencies [466354aaa]
  - @backstage/integration@0.2.0

## 0.4.2

### Patch Changes

- 5ecd50f8a: Fix HTTPS certificate generation and add new config switch, enabling it simply by setting `backend.https = true`. Also introduces caching of generated certificates in order to avoid having to add a browser override every time the backend is restarted.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 0829ff126: Tweaked development log formatter to include extra fields at the end of each log line
- 036a84373: Provide support for on-prem azure devops
- Updated dependencies [ad5c56fd9]
- Updated dependencies [036a84373]
  - @backstage/config-loader@0.4.1
  - @backstage/integration@0.1.5

## 0.4.1

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- Updated dependencies [1d1c2860f]
- Updated dependencies [4eafdec4a]
- Updated dependencies [178e09323]
  - @backstage/integration@0.1.4

## 0.4.0

### Minor Changes

- 12bbd748c: Removes the Prometheus integration from `backend-common`.

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

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- Updated dependencies [38e24db00]
- Updated dependencies [b8ecf6f48]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/integration@0.1.3
  - @backstage/config@0.1.2

## 0.3.3

### Patch Changes

- 612368274: Allow the `backend.listen.port` config to be both a number or a string.
- Updated dependencies [4e7091759]
- Updated dependencies [b4488ddb0]
  - @backstage/config-loader@0.4.0

## 0.3.2

### Patch Changes

- 3aa7efb3f: Added support for passing false as a CSP field value, to drop it from the defaults in the backend
- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration
- Updated dependencies [b3d4e4e57]
  - @backstage/integration@0.1.2

## 0.3.1

### Patch Changes

- bff3305aa: Added readTree support to AzureUrlReader
- b47dce06f: Make integration host and url configurations visible in the frontend

## 0.3.0

### Minor Changes

- 1722cb53c: Added support for loading and validating configuration schemas, as well as declaring config visibility through schemas.

  The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

  A configuration schema is declared using the `https://backstage.io/schema/config-v1` JSON Schema meta schema, which is based on draft07. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, and `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

  Packages that wish to contribute configuration schema should declare it in a root `"configSchema"` field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be in either `.json` or `.d.ts` format.

  TypeScript configuration schema files should export a single `Config` type, for example:

  ```ts
  export interface Config {
    app: {
      /**
       * Frontend root URL
       * @visibility frontend
       */
      baseUrl: string;
    };
  }
  ```

- 8e2effb53: Refactored UrlReader.readTree to be required and accept (url, options)

### Patch Changes

- 1722cb53c: Added configuration schema
- 7b37e6834: Added the integration package
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
  - @backstage/config-loader@0.3.0
  - @backstage/integration@0.1.1
  - @backstage/test-utils@0.1.3

## 0.2.1

### Patch Changes

- 33b7300eb: Capture plugin name under the /api/ prefix for http metrics

## 0.2.0

### Minor Changes

- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- e37c0a005: Use localhost to fall back to IPv4 if IPv6 isn't available
- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6579769df: Add the ability to import components from Bitbucket Server to the service catalog
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 8afce088a: Use APP_ENV before NODE_ENV for determining what config to load
- 7bbeb049f: Change loadBackendConfig to return the config directly

### Patch Changes

- 440a17b39: Added new UrlReader interface for reading opaque data from URLs with different providers.

  This new URL reading system is intended as a replacement for the various integrations towards
  external systems in the catalog, scaffolder, and techdocs. It is configured via a new top-level
  config section called 'integrations'.

  Along with the UrlReader interface is a new UrlReaders class, which exposes static factory
  methods for instantiating readers that can read from many different integrations simultaneously.

- Updated dependencies [8c2b76e45]
- Updated dependencies [ce5512bc0]
  - @backstage/config-loader@0.2.0
  - @backstage/test-utils@0.1.2

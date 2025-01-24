# @backstage/plugin-proxy-backend

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-proxy-node@0.1.1-next.0

## 0.5.10

### Patch Changes

- 11b001c: Added `proxyEndpointsExtensionPoint` to allow addition of proxy configuration through an extension point in the new backend system.
- Updated dependencies
  - @backstage/plugin-proxy-node@0.1.0
  - @backstage/types@1.2.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/config@1.3.2

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0

## 0.5.9

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0

## 0.5.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0

## 0.5.9-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0

## 0.5.8

### Patch Changes

- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/backend-plugin-api@1.0.2

## 0.5.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.7

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.7-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.6

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- d298e6e: Deprecated `createRouter` and its router options in favour of the new backend system.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.6-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- d298e6e: Deprecated `createRouter` and its router options in favour of the new backend system.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.4

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- b63d378: Update internal imports
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.4-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.0

### Minor Changes

- 88480e4: **BREAKING**: The proxy backend plugin is now protected by Backstage auth, by
  default. Unless specifically configured (see below), all proxy endpoints will
  reject requests immediately unless a valid Backstage user or service token is
  passed along with the request. This aligns the proxy with how other Backstage
  backends behave out of the box, and serves to protect your upstreams from
  unauthorized access.

  A proxy configuration section can now look as follows:

  ```yaml
  proxy:
    endpoints:
      '/pagerduty':
        target: https://api.pagerduty.com
        credentials: require # NEW!
        headers:
          Authorization: Token token=${PAGERDUTY_TOKEN}
  ```

  There are three possible `credentials` settings at this point:

  - `require`: Callers must provide Backstage user or service credentials with
    each request. The credentials are not forwarded to the proxy target.
  - `forward`: Callers must provide Backstage user or service credentials with
    each request, and those credentials are forwarded to the proxy target.
  - `dangerously-allow-unauthenticated`: No Backstage credentials are required to
    access this proxy target. The target can still apply its own credentials
    checks, but the proxy will not help block non-Backstage-blessed callers. If
    you also add `allowedHeaders: ['Authorization']` to an endpoint configuration,
    then the Backstage token (if provided) WILL be forwarded.

  The value `dangerously-allow-unauthenticated` was the old default.

  The value `require` is the new default, so requests that were previously
  permitted may now start resulting in `401 Unauthorized` responses. If you have
  `backend.auth.dangerouslyDisableDefaultAuthPolicy` set to `true`, this does not
  apply; the proxy will behave as if all endpoints were set to
  `dangerously-allow-unauthenticated`.

  If you have proxy endpoints that require unauthenticated access still, please
  add `credentials: dangerously-allow-unauthenticated` to their declarations in
  your app-config.

### Patch Changes

- 8869b8e: Updated local development setup.
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1

## 0.5.0-next.0

### Minor Changes

- 88480e4: **BREAKING**: The proxy backend plugin is now protected by Backstage auth, by
  default. Unless specifically configured (see below), all proxy endpoints will
  reject requests immediately unless a valid Backstage user or service token is
  passed along with the request. This aligns the proxy with how other Backstage
  backends behave out of the box, and serves to protect your upstreams from
  unauthorized access.

  A proxy configuration section can now look as follows:

  ```yaml
  proxy:
    endpoints:
      '/pagerduty':
        target: https://api.pagerduty.com
        credentials: require # NEW!
        headers:
          Authorization: Token token=${PAGERDUTY_TOKEN}
  ```

  There are three possible `credentials` settings at this point:

  - `require`: Callers must provide Backstage user or service credentials with
    each request. The credentials are not forwarded to the proxy target.
  - `forward`: Callers must provide Backstage user or service credentials with
    each request, and those credentials are forwarded to the proxy target.
  - `dangerously-allow-unauthenticated`: No Backstage credentials are required to
    access this proxy target. The target can still apply its own credentials
    checks, but the proxy will not help block non-Backstage-blessed callers. If
    you also add `allowedHeaders: ['Authorization']` to an endpoint configuration,
    then the Backstage token (if provided) WILL be forwarded.

  The value `dangerously-allow-unauthenticated` was the old default.

  The value `require` is the new default, so requests that were previously
  permitted may now start resulting in `401 Unauthorized` responses. If you have
  `backend.auth.dangerouslyDisableDefaultAuthPolicy` set to `true`, this does not
  apply; the proxy will behave as if all endpoints were set to
  `dangerously-allow-unauthenticated`.

  If you have proxy endpoints that require unauthenticated access still, please
  add `credentials: dangerously-allow-unauthenticated` to their declarations in
  your app-config.

### Patch Changes

- 8869b8e: Updated local development setup.
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18

## 0.4.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.4.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0

## 0.4.15

### Patch Changes

- e5a2ccc: Updated dependency `@types/http-proxy-middleware` to `^1.0.0`.
- 43ca784: Updated dependency `@types/yup` to `^0.32.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/config@1.2.0

## 0.4.15-next.1

### Patch Changes

- 43ca784: Updated dependency `@types/yup` to `^0.32.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/config@1.2.0

## 0.4.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0

## 0.4.14

### Patch Changes

- eae097c: Allow unauthenticated requests.
- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/config@1.2.0

## 0.4.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0

## 0.4.12

### Patch Changes

- 1b4fd09: Updated dependency `yup` to `^1.0.0`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14

## 0.4.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1

## 0.4.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1

## 0.4.11-next.0

### Patch Changes

- 1b4fd09: Updated dependency `yup` to `^1.0.0`.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0

## 0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config@1.1.1

## 0.4.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1

## 0.4.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/config@1.1.1

## 0.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1

## 0.4.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1

## 0.4.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/config@1.1.1

## 0.4.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2

## 0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-plugin-api@0.6.9-next.1

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1

## 0.4.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/config@1.1.1

## 0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/config@1.1.1

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1

## 0.4.5

### Patch Changes

- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/config@1.1.1

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1

## 0.4.5-next.0

### Patch Changes

- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/config@1.1.1

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0

## 0.4.0

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- 02ba0a2efd2a: Add the route name to an error message that appears when the backend
  proxy wasn't well configured. This will help users to understand the
  issue and fix the right configuration.
- 03691f0f3270: Add back the legacy proxy config, to get secret redaction
- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.3

## 0.4.0-next.3

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- 02ba0a2efd2a: Add the route name to an error message that appears when the backend
  proxy wasn't well configured. This will help users to understand the
  issue and fix the right configuration.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8

## 0.3.0

### Minor Changes

- 7daf65bfcfa1: Defining proxy endpoints directly under the root `proxy` configuration key is deprecated. Endpoints should now be declared under `proxy.endpoints` instead. The `skipInvalidProxies` and `reviveConsumedRequestBodies` can now also be configured through static configuration.

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/config@1.0.8

## 0.3.0-next.2

### Minor Changes

- 7daf65bfcfa1: Defining proxy endpoints directly under the root `proxy` configuration key is deprecated. Endpoints should now be declared under `proxy.endpoints` instead. The `skipInvalidProxies` and `reviveConsumedRequestBodies` can now also be configured through static configuration.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.2.42-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/config@1.0.8

## 0.2.42-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/config@1.0.8

## 0.2.41

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/config@1.0.8

## 0.2.41-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/config@1.0.8

## 0.2.40

### Patch Changes

- 95987388f26b: Marked headers `Authorization` and `X-Api-Key` as secret in order to not show up in frontend configuration.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/config@1.0.8

## 0.2.40-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/config@1.0.7

## 0.2.40-next.1

### Patch Changes

- 95987388f26b: Marked headers `Authorization` and `X-Api-Key` as secret in order to not show up in frontend configuration.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/config@1.0.7

## 0.2.40-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.2.39

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7

## 0.2.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.2.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7

## 0.2.38

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7

## 0.2.38-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/config@1.0.7

## 0.2.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7

## 0.2.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.2.37

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 3e3eea4bc7e: The proxy-backend plugin now supports reviving request bodies that have previously been consumed by an express middleware (e.g. `express.json()`). This is done by setting `reviveConsumedRequestBodies: true` on the proxy `RouterOptions`. In order to preserve the current behavior, the proxy will **not** revive request bodies by default.

  The following is an example of a proxy `createRouter` invocation that revives request bodies:

  ```diff
  const router = await createRouter({
    config,
    logger,
    discovery,
  + reviveConsumedRequestBodies: true,
  });
  ```

- 4acd93dae1d: Ensure that `@backstage/plugin-proxy-backend` logs the requests that it proxies when log level is set to `debug`.
- Updated dependencies
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/config@1.0.7

## 0.2.37-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.2.37-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/config@1.0.7-next.0

## 0.2.37-next.0

### Patch Changes

- 3e3eea4bc7: The proxy-backend plugin now supports reviving request bodies that have previously been consumed by an express middleware (e.g. `express.json()`). This is done by setting `reviveConsumedRequestBodies: true` on the proxy `RouterOptions`. In order to preserve the current behavior, the proxy will **not** revive request bodies by default.

  The following is an example of a proxy `createRouter` invocation that revives request bodies:

  ```diff
  const router = await createRouter({
    config,
    logger,
    discovery,
  + reviveConsumedRequestBodies: true,
  });
  ```

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/config@1.0.6

## 0.2.36

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/config@1.0.6

## 0.2.36-next.2

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/config@1.0.6

## 0.2.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6

## 0.2.36-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.2.34

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6

## 0.2.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0

## 0.2.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## 0.2.33

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 03843259b4: Documented the `createRouter` method.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5

## 0.2.33-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1

## 0.2.33-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/config@1.0.5-next.1

## 0.2.33-next.1

### Patch Changes

- 03843259b4: Documented the `createRouter` method.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/config@1.0.5-next.1

## 0.2.33-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/config@1.0.5-next.0

## 0.2.32

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/config@1.0.4

## 0.2.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/config@1.0.4-next.0

## 0.2.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/config@1.0.4-next.0

## 0.2.31

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/config@1.0.3

## 0.2.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/config@1.0.3-next.2

## 0.2.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/config@1.0.3-next.1

## 0.2.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0

## 0.2.30

### Patch Changes

- f6be17460d: Minor API signatures cleanup
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/config@1.0.2

## 0.2.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/backend-common@0.15.1-next.3

## 0.2.30-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2

## 0.2.30-next.0

### Patch Changes

- f6be17460d: Minor API signatures cleanup
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0

## 0.2.29

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0

## 0.2.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0

## 0.2.28

### Patch Changes

- a4fa1ce090: The proxy-backend now automatically reloads configuration when app-config.yaml is updated.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1

## 0.2.28-next.1

### Patch Changes

- a4fa1ce090: The proxy-backend now automatically reloads configuration when app-config.yaml is updated.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.1-next.3

## 0.2.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0

## 0.2.27

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0

## 0.2.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2

## 0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0

## 0.2.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1

## 0.2.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0

## 0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0

## 0.2.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2

## 0.2.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0

## 0.2.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/config@1.0.0

## 0.2.23

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0

## 0.2.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0

## 0.2.22

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0

## 0.2.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.11.0

## 0.2.20

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15

## 0.2.19

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/config@0.1.14

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.2.17

### Patch Changes

- 332d3decb2: Adds a new option `skipInvalidTargets` for the proxy `createRouter` which allows the proxy backend to be started with an invalid proxy configuration. If configured, it will simply skip the failed proxy and mount the other valid proxies.

  To configure it to pass by failing proxies:

  ```
  const router = await createRouter({
    config,
    logger,
    discovery,
    skipInvalidProxies: true,
  });
  ```

  If you would like it to fail if a proxy is configured badly:

  ```
  const router = await createRouter({
    config,
    logger,
    discovery,
  });
  ```

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.2.17-next.0

### Patch Changes

- 332d3decb2: Adds a new option `skipInvalidTargets` for the proxy `createRouter` which allows the proxy backend to be started with an invalid proxy configuration. If configured, it will simply skip the failed proxy and mount the other valid proxies.

  To configure it to pass by failing proxies:

  ```
  const router = await createRouter({
    config,
    logger,
    discovery,
    skipInvalidProxies: true,
  });
  ```

  If you would like it to fail if a proxy is configured badly:

  ```
  const router = await createRouter({
    config,
    logger,
    discovery,
  });
  ```

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.2.14

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.2.13

### Patch Changes

- 957e4b3351: Updated dependencies
- Updated dependencies
  - @backstage/backend-common@0.9.6

## 0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.2.11

### Patch Changes

- 13da7be3c: Clean up proxy creation log messages and make them include the mount path.

## 0.2.10

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- 6ffcf9ed8: Bump http-proxy-middleware from 0.19.2 to 2.0.0
- Updated dependencies
  - @backstage/backend-common@0.8.3

## 0.2.9

### Patch Changes

- 875809a59: Fixed proxy requests to the base URL of routes without a trailing slash redirecting to the `target` with the full path appended.
- Updated dependencies [92963779b]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2

## 0.2.8

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.2.7

### Patch Changes

- cdb3426e5: Prefix proxy routes with `/` if not present in configuration
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/config@0.1.5

## 0.2.6

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.2.5

### Patch Changes

- 1987c9341: Added a verification for well formed URLs when processing proxy targets. Otherwise users gets a cryptic error message thrown from Express which makes it hard to debug.
- 9ce68b677: Fix for proxy-backend plugin when global-agent is enabled
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/backend-common@0.5.5

## 0.2.4

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.2.2

### Patch Changes

- 6a6c7c14e: Filter the headers that are sent from the proxied-targed back to the frontend to not forwarded unwanted authentication or
  monitoring contexts from other origins (like `Set-Cookie` with e.g. a google analytics context). The implementation reuses
  the `allowedHeaders` configuration that now controls both directions `frontend->target` and `target->frontend`.
- 3619ea4c4: Add configuration schema for the commonly used properties
- Updated dependencies [612368274]
  - @backstage/backend-common@0.3.3

## 0.2.1

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 9226c2aaa: Limit the http headers that are forwarded from the request to a safe set of defaults.
  A user can configure additional headers that should be forwarded if the specific applications needs that.

  ```yaml
  proxy:
    '/my-api':
      target: 'https://my-api.com/get'
      allowedHeaders:
        # We need to forward the Authorization header that was provided by the caller
        - Authorization
  ```

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0

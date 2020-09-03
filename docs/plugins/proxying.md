---
id: proxying
title: Proxying
---

## Overview

The Backstage backend comes packaged with a basic HTTP proxy, that can aid in
reaching backend service APIs from frontend plugin code. See
[Call Existing API](call-existing-api.md) for a description of when the proxy
can be the best choice for communicating with an API.

## Getting Started

The plugin is already added to a default Backstage project.

In `packages/backend/src/index.ts`:

```ts
const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));

const service = createServiceBuilder(module)
  .loadConfig(configReader)
  /** ... other routers ... */
  .addRouter('/proxy', await proxy(proxyEnv, '/proxy'));
```

## Configuration

Configuration for the proxy plugin lives under a `proxy` root key of your
`app-config.yaml` file.

Example:

```yaml
# in app-config.yaml
proxy:
  '/simple-example': http://simple.example.com:8080
  '/larger-example/v1':
    target: http://larger.example.com:8080/svc.v1
    headers:
      Authorization:
        $secret:
          env: EXAMPLE_AUTH_HEADER
```

Each key under the proxy configuration entry is a route to match, below the
prefix that the proxy plugin is mounted on. It must start with a slash. For
example, if the backend mounts the proxy plugin as `/proxy`, the above
configuration will lead to the proxy acting on backend requests to
`/proxy/simple-example/...` and `/proxy/larger-example/v1/...`.

The value inside each route is either a simple URL string, or an object on the
format accepted by
[http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware).

If the value is a string, it is assumed to correspond to:

```yaml
target: <the string>
changeOrigin: true
pathRewrite:
  '^<url prefix><the string>/': '/'
```

When the target is an object, it is given verbatim to `http-proxy-middleware`
except with the following caveats for convenience:

- If `changeOrigin` is not specified, it is set to `true`. This is the most
  commonly useful value.
- If `pathRewrite` is not specified, it is set to a single rewrite that removes
  the entire prefix and route. In the above example, a rewrite of
  `'^/proxy/larger-example/v1/': '/'` is added. That means that a request to
  `/proxy/larger-example/v1/some/path` will be translated to a request to
  `http://larger.example.com:8080/svc.v1/some/path`.

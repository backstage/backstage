---
id: corporate-proxy
title: Running Backstage behind a Corporate Proxy
description: Guide on how to configure Backstage to work behind a corporate proxy using Node.js built-in proxy support.
---

# Running Backstage behind a Corporate Proxy

Sometimes you have to run Backstage with no direct access to the public internet, except through a corporate proxy. The backend is most likely where you'll run into proxy issues, as it isn't helped by your browser or OS proxy settings.

## Using Node.js built-in proxy support

Starting with Node.js 22.21.0 and 24.5.0, Node.js has built-in support for proxy environment variables. When enabled, native `fetch()`, `node:http`, and `node:https` all respect the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables without any additional packages. See the [Node.js enterprise network configuration docs](https://nodejs.org/en/learn/http/enterprise-network-configuration#proxy-configuration) for full details.

To enable the built-in proxy support, set the `NODE_USE_ENV_PROXY` environment variable along with your proxy settings:

```sh
export HTTP_PROXY=http://username:password@proxy.example.net:8888
export HTTPS_PROXY=http://username:password@proxy.example.net:8888
export NO_PROXY=localhost,127.0.0.1,.internal.company.com
export NODE_USE_ENV_PROXY=1
yarn start
```

### Compatibility with third-party fetch libraries

Per [ADR014](../architecture-decisions/adr014-use-fetch.md), Backstage backend code should use native `fetch()`, which works with Node.js's proxy out of the box. Some core packages and many [community plugins](https://github.com/backstage/community-plugins/) still use `node-fetch` (see [ADR013](../architecture-decisions/adr013-use-node-fetch.md)) or `cross-fetch` (for isomorphic packages). Both libraries delegate to `node:http`/`node:https` internally and do **not** set a custom HTTP agent by default, which means Node.js's proxy works for them as well.

The exception is code that explicitly passes a custom `agent` to its fetch calls (e.g. the Kubernetes plugins, which use `new https.Agent(...)` for TLS client certificates). In those cases, the custom agent takes precedence and the built-in proxy is bypassed. This is generally the desired behavior, since those agents are configured for direct connections to specific endpoints like cluster APIs.

---
'@backstage/cli-common': patch
---

Deprecated `bootstrapEnvProxyAgents()` in favor of Node.js built-in proxy support. Set `NODE_USE_ENV_PROXY=1` alongside your `HTTP_PROXY`/`HTTPS_PROXY` environment variables instead. See the [corporate proxy guide](https://backstage.io/docs/tutorials/corporate-proxy/) for details. This function will be removed in a future release.

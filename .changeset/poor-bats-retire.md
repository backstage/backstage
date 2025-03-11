---
'@backstage/app-defaults': minor
---

**BREAKING**: The default `DiscoveryApi` implementation has been switched to use `FrontendHostDiscovery`, which adds support for the `discovery.endpoints` configuration.

This is marked as a breaking change because it will cause any existing `discovery.endpoints` configuration to be picked up and used, which may break existing setups.

For example, consider the following configuration:

```yaml
app:
  baseUrl: https://backstage.acme.org

backend:
  baseUrl: https://backstage.internal.acme.org

discovery:
  endpoints:
    - target: https://catalog.internal.acme.org/api/{{pluginId}}
      plugins: [catalog]
```

This will now cause requests from the frontend towards the `catalog` plugin to be routed to `https://catalog.internal.acme.org/api/catalog`, but this might not be reachable from the frontend. To fix this, you should update the `discovery.endpoints` configuration to only override the internal URL of the plugin:

```yaml
discovery:
  endpoints:
    - target:
        internal: https://catalog.internal.acme.org/api/{{pluginId}}
      plugins: [catalog]
```

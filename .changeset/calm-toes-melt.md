---
'@backstage/core-app-api': patch
---

The `defaultConfigLoader` now also reads configuration from scripts tags with `type="backstage.io/config"`. The tag is expected to contain a JSON-serialized array of `AppConfig` objects. If any of these script tags are present, the injected runtime configuration in the static assets will no longer be used.

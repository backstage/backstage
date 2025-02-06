---
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-techdocs-node': patch
---

Support timeout in the techdocs generator

This allows to set a timeout for the techdocs generator to prevent it from running indefinitely.
The timeout can be configured in the techdocs-backend config with `techdocs.generator.timeout`
key.

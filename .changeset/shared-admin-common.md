---
'@backstage/plugin-permission-common': patch
---

Adds a shared resource-based administration permission in the alpha API. Plugins can check administration of a specific plugin or require an unconditional grant across all plugins.

Authorization requests now support `resourceRef: false` to require an unconditional grant across all resources. This returns a definitive decision without exposing policy conditions, including when batching scoped and universal checks together. Requires an updated permission backend.

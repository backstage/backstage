---
'@backstage/core-plugin-api': minor
---

Removed the deprecated `id` field of `BackstageIdentityResponse`.

Existing usage can be replaced by parsing the `name` of the `identity.userEntityRef` with `parseEntityRef` from `@backstage/catalog-model`, although note that it is recommended to consume the entire `userEntityRef` in order to support namespaces.

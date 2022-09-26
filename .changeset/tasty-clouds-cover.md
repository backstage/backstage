---
'@backstage/cli': patch
---

Added dependency on `@types/jest` v27. The `@types/jest` dependency has also been removed from the plugin template and should be removed from any of your own internal packages. If you wish to override the version of `@types/jest` or `jest`, use Yarn resolutions.

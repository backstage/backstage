---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
'@backstage/core-compat-api': patch
---

Allow external route refs in the new system to have a `defaultTarget` pointing to a route that it'll resolve to by default if no explicit bindings were made by the adopter.

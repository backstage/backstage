---
'@backstage/backend-defaults': patch
---

The `jwks` external access method now supports an optional `claims` config option, letting you restrict which callers are accepted based on the claims in their JWT.

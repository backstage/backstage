---
'@backstage/plugin-catalog': patch
---

The Catalog index route now targets `page:catalog`, so replacement pages no longer need to register its route reference. Existing legacy mount points and hybrid page conversion remain supported.

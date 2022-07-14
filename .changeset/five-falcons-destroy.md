---
'@backstage/plugin-scaffolder-backend': patch
---

Add `copyWithoutTemplating` to the fetch template action input. `copyWithoutTemplating` also accepts an array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.

Deprecate `copyWithoutRender` in favor of `copyWithoutTemplating`.

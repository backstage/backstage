---
'@backstage/cli': patch
---

Switch from using deprecated `@esbuild-kit/*` packages to using `tsx`. This also switches to using the new module loader `register` API when available, avoiding the experimental warning when starting backends.

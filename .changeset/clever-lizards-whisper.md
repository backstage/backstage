---
'@backstage/cli': patch
---

When building a backend package with dependencies any `--config <path>` options will now be forwarded to any dependent app package builds, unless the build script in the app package already contains a `--config` option.

---
'@backstage/cli': patch
---

Allow passing `--config` option to `repo build` command. The option will only be forwarded to packages with the package role `'frontend'`, and only if the build script in the package does not already have any `--config` options.

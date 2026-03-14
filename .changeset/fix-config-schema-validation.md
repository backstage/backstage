---
'@backstage/cli': patch
---

Added config schema validation to `repo fix` command. When a package contains a `config.d.ts` file, the fixer ensures that `configSchema` in `package.json` references it and that it is included in the `files` array.

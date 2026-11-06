---
'@backstage/cli-module-migrate': patch
---

The `migrate package-lint-configs` command now formats the files it writes through the Prettier API, so it no longer needs a Prettier executable on the path.

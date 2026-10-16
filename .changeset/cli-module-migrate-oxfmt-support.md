---
'@backstage/cli-module-migrate': patch
---

The `migrate package-lint-configs` command now formats the files it writes with oxfmt when it's installed in the project root and either configured there or the only formatter installed. Otherwise Prettier is used as before.

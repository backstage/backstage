---
'@backstage/cli-module-migrate': patch
---

The `migrate package-lint-configs` command now formats the files it writes with oxfmt when the root `package.json` lists it as a dependency and it's either configured in the project root or the only formatter listed. Otherwise Prettier is used if the root `package.json` lists it.

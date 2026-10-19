---
'@backstage/cli-module-migrate': patch
---

Added support for oxfmt as an alternative to Prettier when the `migrate package-lint-configs` command formats the files it writes. oxfmt is used when the root `package.json` lists it as a dependency and it's either configured in the project root or the only formatter listed. Otherwise Prettier is used as before, if the root `package.json` lists it.

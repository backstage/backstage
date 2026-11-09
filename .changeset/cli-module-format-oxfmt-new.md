---
'@backstage/cli-module-format-oxfmt': patch
---

Added a new CLI module that provides the `package format` command using [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) instead of Prettier. Add both `oxfmt` and this module to the root `package.json` to have it replace the Prettier formatting from `@backstage/cli-defaults`.

---
'@backstage/cli': minor
---

**BREAKING**: The lockfile (`yarn.lock`) dependency analysis and mutations have been removed from several commands.

The `versions:bump` command will no longer attempt to bump and deduplicate dependencies by modifying the lockfile, it will only update `package.json` files.

The `versions:check` command has been removed, since its only purpose was verification and mutation of the lockfile. We recommend using the `yarn dedupe` command instead, or the `yarn-deduplicate` package if you're using Yarn classic.

The check that was built into the `package start` command has been removed, it will no longer warn about lockfile mismatches.

The packages in the Backstage ecosystem handle package duplications much better now than when these CLI features were first introduced, so the need for these features has diminished. By removing them, we drastically reduce the integration between the Backstage CLI and Yarn, making it much easier to add support for other package managers in the future.

---
'@backstage/cli-node': patch
---

Added an experimental package manager API in the new `@backstage/cli-node/alpha` entry point. `detectPackageManager()` returns the `PackageManager` of a workspace, which installs dependencies, runs scripts, packs packages, fetches package information, and reads the lockfile. Yarn is the only implementation so far. The API may change in any release while it is experimental.

The package now has an `exports` field in its `package.json`, which comes with the new entry point. Imports of files inside the package, such as `@backstage/cli-node/dist/...`, no longer work.

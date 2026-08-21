---
id: module-yarn
title: Yarn Module
description: CLI command for verifying Yarn patch references.
---

The Yarn module (`@backstage/cli-module-yarn`) verifies that Yarn patch
references, local patch files, and `yarn.lock` remain aligned. When a project
patches a Backstage package, it also checks that the package version matches
the Backstage release selected in `backstage.json`.

The command verifies Yarn's native `patch:` protocol, available in Yarn 2 and
later. It does not inspect patches managed by tools such as `patch-package` in
Yarn Classic repositories.

## repo verify-yarn-patches

Run this command from the root of a Yarn repository:

```shell
yarn backstage-cli repo verify-yarn-patches
```

The command scans the root and workspace `package.json` files for `patch:`
references in `resolutions`, `dependencies`, `devDependencies`,
`optionalDependencies`, and `peerDependencies`. It reports all of the
following problems together before exiting unsuccessfully:

- Missing or orphaned local patch files.
- Patch references that do not agree with `yarn.lock`.
- Patched `@backstage/*` packages that are missing from, or do not match, the
  selected Backstage release.

The command is read-only: it does not run Yarn, install dependencies, or write
project files. Use it alongside `yarn install --immutable`; immutable installs
protect the resolved dependency state, while this command verifies that patch
declarations and the selected Backstage release remain aligned.

For offline or mirrored environments, set `BACKSTAGE_MANIFEST_FILE` to a local
release manifest or `BACKSTAGE_VERSIONS_BASE_URL` to the base URL from which
release manifests are fetched.

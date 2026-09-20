---
id: module-package-manager-yarn
title: Yarn Package Manager Module
description: CLI command for verifying Yarn patch references.
---

The Yarn package manager module (`@backstage/cli-module-package-manager-yarn`)
verifies that Yarn patch
references, local patch files, and `yarn.lock` remain aligned. When a project
patches a Backstage package, it also checks that the package version matches
the Backstage release selected in `backstage.json`.

See [Generating temporary patches](../local-dev/linking-local-packages.md#generating-temporary-patches)
for guidance on creating Yarn patches for locally modified Backstage packages.

The command verifies Yarn's native `patch:` protocol, available in Yarn 2 and
later. It does not inspect patches managed by tools such as `patch-package` in
Yarn Classic repositories.

## pm verify-patches

Run this command from the root of a Yarn repository:

```shell
yarn backstage-cli pm verify-patches
```

The command scans the root and workspace `package.json` files for `patch:`
references in `resolutions`, `dependencies`, `devDependencies`,
`optionalDependencies`, and `peerDependencies`. It reports all of the
following problems together before exiting unsuccessfully:

- Missing or orphaned local patch files.
- Patch references that do not agree with `yarn.lock`.
- Patched `@backstage/*` packages that are missing from, or do not match, the
  selected Backstage release.

By default, the command is read-only: it does not run Yarn, install
dependencies, or write project files. Use it alongside `yarn install
--immutable`; immutable installs protect the resolved dependency state, while
this command verifies that patch declarations and the selected Backstage
release remain aligned.

If a release upgrade leaves one project-owned Backstage patch pinned to the old
package version, use `--fix` to attempt a conservative repair:

```shell
yarn backstage-cli pm verify-patches --fix
```

The fix is limited to one exact-version `@backstage/*` patch in the root
`resolutions`. The command stages the workspace manifests, patches, and
lockfile in a temporary directory, verifies that Yarn can apply the existing
patch to the target release version, and rejects unrelated lockfile changes.
Only after the staged project passes the normal verification does it update
`package.json` and `yarn.lock`. Dependency build scripts are disabled during
the staged install, which uses the repository's configured Yarn binary and
plugins from the conventional `.yarn/releases` and `.yarn/plugins` locations.
If the declaration is ambiguous or the patch no longer applies cleanly, the
command leaves the project untouched and exits with the original verification
failure.

Use `--fix --dry-run` to perform the staged install and verification without
writing project files.

For offline or mirrored environments, set `BACKSTAGE_MANIFEST_FILE` to a local
release manifest or `BACKSTAGE_VERSIONS_BASE_URL` to the base URL from which
release manifests are fetched.

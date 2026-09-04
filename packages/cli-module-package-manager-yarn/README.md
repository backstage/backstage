# @backstage/cli-module-package-manager-yarn

Adds `backstage-cli pm verify-patches`, a read-only check for Yarn patch
references and patched Backstage package versions.

The command verifies Yarn's native `patch:` protocol, available in Yarn 2 and
later. It does not inspect patches managed by tools such as `patch-package` in
Yarn Classic repositories.

## Usage

Run the command from a Yarn repository root:

```shell
yarn backstage-cli pm verify-patches
```

The command scans the root `package.json` and every workspace manifest for
`patch:` references in `resolutions`, `dependencies`, `devDependencies`,
`optionalDependencies`, and `peerDependencies`. It verifies that referenced
local patch files exist, files in Yarn's configured `patchFolder` are
referenced, and manifest declarations agree with `yarn.lock`.

When a repository both patches an `@backstage/*` package and declares a
Backstage release in `backstage.json`, the command also verifies that the
patched package version matches the selected release manifest. All findings
are printed together and the command exits unsuccessfully if any are found.
Repositories without `backstage.json` still receive generic patch validation;
the Backstage release check is reported as skipped.

The command does not run Yarn, install dependencies, or write project files.
Use it alongside `yarn install --immutable`: immutable installs protect the
resolved dependency state, while this command verifies that patch declarations,
patch files, the lockfile, and the selected Backstage release remain aligned.

## Release manifest environment

For patched Backstage packages, the command loads the manifest for the release
selected in `backstage.json`. It supports the same manifest environment
variables as other Backstage version tooling:

- `BACKSTAGE_MANIFEST_FILE` — path to a local release manifest, useful for
  offline or mirrored environments.
- `BACKSTAGE_VERSIONS_BASE_URL` — base URL from which to fetch release
  manifests when a local manifest is not supplied.

If manifest validation is required but the selected manifest cannot be loaded
or does not match the selected release, verification fails.

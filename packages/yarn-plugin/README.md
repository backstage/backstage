# yarn-plugin-backstage

This yarn plugin adds a `backstage:` version protocol to yarn, which replaces
specific version ranges for `@backstage/` packages. The only version range
supported by this plugin is `backstage:^`, which has similar semantics to the
corresponding [`workspace` range](https://yarnpkg.com/features/workspaces#cross-references) when using
workspace dependencies; locally, the package will always resolve to the exact
version specified in the manifest for the Backstage release listed in
backstage.json. If the dependent package is published, this version will be
prefixed by `^`.

Detailed instructions for using the plugin can be found in [the docs](https://backstage.io/docs/getting-started/keeping-backstage-updated/#managing-package-versions-with-the-backstage-yarn-plugin).

## Installation

```bash
yarn plugin import https://versions.backstage.io/v1/tags/main/yarn-plugin
```

The resulting changes in the file system should be committed to your repo.

## Usage

The yarn plugin recognizes the version string `"backstage:^"`, and replaces it
with the appropriate version based on the overall Backstage version in
backstage.json.

## Local Development

- Run unit tests: `yarn test`
- Build the plugin locally: `yarn build`
- Rebuild whenever plugin files change: `yarn start`
- Install local build (in a package directory outside the Backstage monorepo):
  `yarn plugin import
/path/to/backstage-repo/packages/yarn-plugin/bundles/@yarnpkg/plugin-backstage.js`

The plugin can be manually tested in any repository running at least yarn 4.1.1.
Sadly it can't be manually tested directly in the Backstage monorepo - since
packages in this repository use `workspace:^` dependencies, there's no use case
for the yarn plugin.

## Architecture

This section is intended for people working directly on this package. It
describes the architecture of the plugin, and the means by which it manages npm
package versions.

The Backstage yarn plugin operates on `backstage:^` version ranges in
package.json files using the following three components:

### `reduceDependency` hook

_Converts `backstage:^` to `backstage:^::backstage=1.34.0&npm=1.2.3`_

This hook is called by yarn when resolving direct and indirect dependencies in
the workspace, and allows modifying the version range. The yarn plugin uses this
hook to parameterize `backstage:^` ranges with the current Backstage version and
the corresponding npm package version from the manifest. This uses the system
built into yarn for adding parameters to version ranges. An

### `BackstageNpmResolver`

_Resolves the appropriate npm package for `backstage:^` ranges and adds the
`npm` range as a dependency_

The `BackstageNpmResolver` ensures that the lockfile contains entries for _both_
the `backstage:^` range, and the corresponding `npm:^<version>` range. Including
an entry for the `backstage:^` range means that tools that reconcile the
lockfile and package.json can match entries for Backstage packages together.
Including an entry for the corresponding `npm:` range ensures that dependencies
are not unlocked when switching between `backstage:^` and `npm:` ranges in the
lockfile, as happens when publishing the package or building a dist workspace
using `backstage-cli build-workspace`.

### `beforeWorkspacePacking` hook

_Replaces `backstage:^` ranges with the corresponding npm version ranges when
packing packages for publishing_

The yarn plugin is strictly optional, and intended to be opted-into in a
specific Backstage repository. As such, when publishing packages, all
`backstage:^` versions should be removed from the package.json and replaced with
the appropriate npm version ranges. This is handled by the
`beforeWorkspacePacking` hook.

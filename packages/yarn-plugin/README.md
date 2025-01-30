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

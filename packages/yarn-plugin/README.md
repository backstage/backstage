# yarn-plugin-backstage

This yarn plugin adds a `backstage:` version protocol to yarn, which replaces
specific version ranges for `@backstage/` packages. The only version range
supported by this plugin is `backstage:^`, which has similar semantics to the
corresponding [`workspace` range](https://yarnpkg.com/features/workspaces#cross-references) when using
workspace dependencies; locally, the package will always resolve to the exact
version specified in the manifest for the Backstage release listed in
backstage.json. If the dependent package is published, this version will be
prefixed by `^`.

**This plugin is still under active development, and requires some further
testing before we recommend it for general use.**

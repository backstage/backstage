# yarn-plugin-backstage

This yarn plugin adds a `backstage:` version protocol to yarn, which replaces
specific version ranges for `@backstage/` packages. The recommended mode of use
is to set all versions strings to `backstage:*` in package.json, which causes
all versions to be resolved based on the version of Backstage specified in
`backstage.json`. This ensures that all `@backstage/` packages always correspond
to a single release, and removes the need for `package.json` files
to change when upgrading to a new release.

**This plugin is still under active development, and requires some further
testing before we recommend it for general use.**

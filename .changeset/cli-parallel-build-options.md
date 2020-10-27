---
'@backstage/cli': minor
---

Adds a new `BACKSTAGE_CLI_BUILD_PARELLEL` environment variable to control
parallelism for some build steps.

This is useful in CI to help avoid out of memory issues when using `terser`. The
`BACKSTAGE_CLI_BUILD_PARELLEL` environment variable can be set to
`true | false | [integer]` to override the default behaviour. See
[terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin#parallel)
for more details.

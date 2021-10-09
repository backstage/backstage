---
'@backstage/cli': minor
---

The Jest configuration that's included with the Backstage CLI has received several changes.

As a part of migrating to more widespread usage of ESM modules, the default configuration now transforms all source files everywhere, including those within `node_modules`. Due to this change the existing `transformModules` option has been removed and will be ignored. There is also a list of known packages that do not require transforms in the CLI, which will evolve over time. If needed there will also be an option to add packages to this list in the future, but it is not included yet to avoid clutter.

To counteract the slowdown of the additional transforms that have been introduced, the default configuration has also been reworked to enable caching across different packages. Previously each package in a Backstage monorepo would have its own isolated Jest cache, but it is now shared between packages that have a similar enough Jest configuration.

Another change that will speed up test execution is that the transformer for `.esm.js` files has been switched. It used to be an ESM transformer based on Babel, but it is also done by sucrase now since it is significantly faster.

The changes above are not strictly breaking as all tests should still work. It may however cause excessive slowdowns in projects that have configured custom transforms in the `jest` field within `package.json` files. In this case it is either best to consider removing the custom transforms, or overriding the `transformIgnorePatterns` to instead use Jest's default `'/node_modules/'` pattern.

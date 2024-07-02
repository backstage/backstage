---
'@backstage/config-loader': major
---

**BREAKING** The `env` property on the `ConfigSourcesDefaultOptions` interface allows for undefined members.

This change makes `ConfigSourcesDefaultOptions.env` consistent with other parts of this package and the wider
`node` ecosystem. Specifically, with this update `ConfigSourcesDefaultOptions.env`'s types match:

#### EnvConfigSource

- [`EnvConfigSource.constructor`](https://github.com/backstage/backstage/blob/c780320418b7775f18fc0d2cc279ee7db9c7cb25/packages/config-loader/src/sources/EnvConfigSource.ts#L68)
- [`EnvConfigSourceOptions`](https://github.com/backstage/backstage/blob/c780320418b7775f18fc0d2cc279ee7db9c7cb25/packages/config-loader/src/sources/EnvConfigSource.ts#L31)
- [`readEnvConfig`](https://github.com/backstage/backstage/blob/c780320418b7775f18fc0d2cc279ee7db9c7cb25/packages/config-loader/src/sources/EnvConfigSource.ts#L114)

#### NodeJS process.env

- [`ProcessEnv`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/aa121ee3a7a3caa16433b66c1103df5904f612ea/types/node/v18/process.d.ts#L137)
  which extends [`Dict`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/aa121ee3a7a3caa16433b66c1103df5904f612ea/types/node/v18/globals.d.ts#L333-L335)

While this is a somewhat trivial change, it does loosen typings on a public interface, so by definition it's a breaking
change and a major version bump.

You may meed to update your backstage instance if you have built an implementation of `ConfigSources` or any other
functionality that relies on `ConfigSourcesDefaultOptions`. This change means you'll have to update that code to account
for the possibility of `undefined` values inside `ConfigSourcesDefaultOptions.env`, although it is very likely already
accounted for as the typings for [`process.env`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/aa121ee3a7a3caa16433b66c1103df5904f612ea/types/node/v18/process.d.ts#L137)
already include the possibility of [`undefined`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/aa121ee3a7a3caa16433b66c1103df5904f612ea/types/node/v18/globals.d.ts#L333-L335).

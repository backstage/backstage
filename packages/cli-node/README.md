# @backstage/cli-node

This library provides utilities for building CLI tools for Backstage.

The difference between this library and `@backstage/cli-common` is that this library is more feature rich with a larger dependency tree, with less concern for bundle size and installation speed. The `@backstage/cli-common` package on the other hand is intended to be extremely slim and only provide minimal features for use in tools like `@backstage/create-app`.

## Custom CLIs

Use `runCli` to create an executable CLI from a fixed set of directly imported modules:

```ts
import { runCli } from '@backstage/cli-node';
import buildModule from '@backstage/cli-module-build';
import testModule from '@backstage/cli-module-test-jest';
import packageJson from '../package.json';

runCli({
  modules: [buildModule, testModule],
  name: packageJson.name,
  version: packageJson.version,
});
```

The caller owns module selection. The runner does not discover modules or apply module overrides.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)

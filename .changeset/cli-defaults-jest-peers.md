---
'@backstage/cli-defaults': patch
---

Declared the peer dependencies of the Jest test module, the same way `@backstage/cli` does: `jest` is a required peer dependency, and `jsdom`, `jest-environment-jsdom` and `@jest/environment-jsdom-abstract` are optional. Projects that use `@backstage/cli` already provide them. Also added the missing dependency on `@backstage/cli-node`, which the published types import.

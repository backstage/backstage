---
'@backstage/cli': minor
---

**BREAKING**: Bump the version range of `jest` from `^26.0.1` to `^27.5.1`. You can find the complete list of breaking changes [here](https://github.com/facebook/jest/releases/tag/v27.0.0).

We strongly recommend to have completed the [package role migration](https://backstage.io/docs/tutorials/package-role-migration) before upgrading to this version, as the package roles are used to automatically determine the testing environment for each package. If you instead want to set an explicit test environment for each package, you can do so for example in the `"jest"` section in `package.json`. The default test environment for all packages is now `node`, which is also the new Jest default.

Note that one of the breaking changes of Jest 27 is that the `jsdom` environment no longer includes `setImmediate` and `clearImmediate`, which means you might need to update some of your frontend packages. Another notable change is that `jest.useFakeTimers` now defaults to the `'modern'` implementation, which also mocks microtasks.

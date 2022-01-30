---
'@backstage/cli': minor
---

Bump the version range of `jest` from `^26.0.1` to `^27.4.7`. You can find the complete list of breaking changes [here](https://github.com/facebook/jest/releases/tag/v27.0.0).

One of the main breaking changes in Jest 27 is that the default test environment is now `node` rather than `jsdom`. However, this is counteracted in the default Jest configuration provided by the Backstage CLI, as it still defaults the environment to `jsdom`. The future addition of the Backstage package `"role"` field will override this default, setting the test environment to the appropriate value for the role.

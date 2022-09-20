---
'@backstage/cli': minor
---

**BREAKING**: Bumped `jest`, `jest-runtime`, and `jest-environment-jsdom` to v29. This is up from v27, so check out both the [v28](https://jestjs.io/docs/28.x/upgrading-to-jest28) and [v29](https://jestjs.io/docs/upgrading-to-jest29) (later [here](https://jestjs.io/docs/29.x/upgrading-to-jest29)) migration guides.

Particular changes that where encountered in the main Backstage repo are:

- The updated snapshot format.
- `jest.useFakeTimers('legacy')` is now `jest.useFakeTimers({ legacyFakeTimers: true })`.
- Error objects collected by `withLogCollector` from `@backstage/test-utils` are now objects with a `detail` property rather than a string.

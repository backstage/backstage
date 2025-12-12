---
'@backstage/cli': minor
---

**BREAKING**: `jest` is now a peer dependency. If you run tests using Backstage CLI, you must add Jest and its environment dependencies as `devDependencies` in your project.

You can choose to install either Jest 29 or Jest 30. The built-in Jest version before this change was Jest 29, however, we recommend that you switch to Jest 30. Upgrading will solve the `Could not parse CSS stylesheet` errors, allow you to use MSW v2 in web packages, and ensure that you remain compatible with future versions of the Backstage CLI. Support for Jest 29 is temporary, with the purpose of allowing you to upgrade at your own pace, but it will eventually be removed.

- **Jest 29**: Install `jest@^29` and `jest-environment-jsdom@^29`. No migration needed, but you may see `Could not parse CSS stylesheet` warnings/errors when testing components from `@backstage/ui` or other packages using CSS `@layer` declarations.
- **Jest 30**: Install `jest@^30`, `@jest/environment-jsdom-abstract@^30`, and `jsdom@^27`. Fixes the stylesheet parsing warnings/errors, but requires migration steps.

See the [Jest 30 migration guide](https://backstage.io/docs/tutorials/jest30-migration) for detailed migration instructions.

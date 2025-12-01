---
'@backstage/cli': minor
---

**BREAKING**: `jest` is now a peer dependency. If you run tests using Backstage CLI, you must add Jest and its environment dependencies as `devDependencies` in your project.

You can choose to install either Jest 29 or Jest 30:

- **Jest 29**: Install `jest@^29` and `jest-environment-jsdom@^29`. No migration needed, but you may see `Could not parse CSS stylesheet` warnings/errors when testing components from `@backstage/ui` or other packages using CSS `@layer` declarations.
- **Jest 30**: Install `jest@^30`, `@jest/environment-jsdom-abstract@^30`, and `jsdom@^27`. Fixes the stylesheet parsing warnings/errors, but requires migration steps.

See the [Jest 30 migration guide](https://backstage.io/docs/tutorials/jest30-migration) for detailed migration instructions.

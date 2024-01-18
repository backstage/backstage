---
'@backstage/create-app': patch
---

Updated `packages/app` as well as the root `package.json` type resolutions to use React v18.

The `@testing-library/*` dependencies have also been updated to the ones compatible with React v18, and the test at `packages/app/src/App.test.tsx` had been updated to use more modern patterns that work better with these new versions.

For information on how to migrate existing apps to React v18, see the [migration guide](https://backstage.io/docs/tutorials/react18-migration)

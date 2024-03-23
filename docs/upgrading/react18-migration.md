---
id: react18-migration
title: Migrating to React 18
description: Additional resources for the Material UI v5 migration guide specifically for Backstage
---

The Backstage core libraries and plugins are compatible with all versions of React from v16.8 to v18. This means that you can migrate projects at your own pace. We do however encourage you to do so sooner rather than later, both to keep up with the evolving ecosystem, but also because React 18 brings performance improvements, in particular in tests.

## Migration

_Before diving in, this is a heads-up that for large projects this can be a tricky migration due to the fact that it is hard to break down into a gradual migration. In practice the difficult part of this migration is switching to the new version of the `@testing-library/react` package for tests, since there is no overlapping support across major React versions, more on that later._

### Switching to React 18

To switch a project to React 18, there are generally three changes that need to be made.

1. Update the resolutions in your root `package.json` to the new versions of `@types/react` and `@types/react-dom`:

```json title="package.json"
  "resolutions": {
    // highlight-remove-next-line
    "@types/react": "^17",
    // highlight-remove-next-line
    "@types/react-dom": "^17",
    // highlight-add-next-line
    "@types/react": "^18",
    // highlight-add-next-line
    "@types/react-dom": "^18",
  },
```

2. Update the `react` and `react-dom` dependencies in your `packages/app/package.json` to the new versions:

```json title="packages/app/package.json"
  "dependencies": {
    ...
    // highlight-remove-next-line
    "react": "^17.0.2",
    // highlight-remove-next-line
    "react-dom": "^17.0.2",
    // highlight-add-next-line
    "react": "^18.0.2",
    // highlight-add-next-line
    "react-dom": "^18.0.2",
    ...
  },
```

3. Update `packages/app/src/index.tsx` to use the new `react-dom/client` API to render the app:

```tsx title="packages/app/src/index.tsx"
import '@backstage/cli/asset-types';
import React from 'react';
// highlight-remove-next-line
import ReactDOM from 'react-dom';
// highlight-add-next-line
import ReactDOM from 'react-dom/client';
import App from './App';

// highlight-remove-next-line
ReactDOM.render(<App />, document.getElementById('root'));
// highlight-add-next-line
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

Once these steps are done you should be able to run your app and see it working as before, except now using React 18.

### TypeScript Errors

When upgrading to React 18 you are likely to see a fair number of TypeScript type errors. A summary of the breaking changes can be found in the [Pull Request that introduced them](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210). A codemod is also provided to help with the migration.

Run `yarn tsc:full` to asses the damage.

The good news is that these errors can be fixed while still staying on React 17. If you have a large number of errors to fix you can address as few or many is you like at a time and merge them into your main branch **without** the version bumps from step 1. This lets you gradually migrate the types in your project while not yet fully moving over to React 18. Once all type breakages are fixed you can move on to the next step of migrating tests.

### Migrating Tests

At this point the app hopefully works and you have no type errors, but if you run your tests you may see that a lot of them are failing. This is because the current version of the `@testing-library/react` package does not support React 18. Unfortunately the new version that we will be moving to does not support React 17, which is why we need to do this all at once.

:::info
If migrating your entire project at once is not feasible, you can try to add `devDependencies` for `react` and `react-dom` v17 to individual plugins to be migrated later. This is not something we have tried ourselves in practice, so let us know in the community Discord if you attempt this and how it goes.
:::

#### Dependency Upgrades

To get the tests working again we need to update `@testing-library/react` to at least v13, although while at it is sensible to move at least all the way to v14 since the additional breaking changes have low impact. For more information on the changes in v13, see the [release notes](https://github.com/testing-library/react-testing-library/releases/tag/v13.0.0).

In addition to bumping `@testing-library/react` you also need to remove the `@testing-library/react-hooks` package, since it is now included in `@testing-library/react` itself. You can find more information on this change in the `@testing-library/react-hooks` [README.md](https://github.com/testing-library/react-hooks-testing-library?tab=readme-ov-file#a-note-about-react-18-support).

The following search-and-replace RegEx patterns may by helpful in updating your `package.json` files:

Find: `"@testing-library/react": ".*"`<br>
Replace: `"@testing-library/react": "^14.0.0"`

Find: `"@testing-library/react-hooks": ".*",?`<br>
Replace: `<nothing>`

#### Test Updates

Once you have installed the new versions of the dependencies this turns into a fairly mechanical process of updating the tests. Use your own favorite method for this, running all tests once to find the breakages and then focusing on one test file at a time was fairly smooth.

When updating the tests in the Backstage project we found the following patterns to be useful:

- Many existing `act(...)` calls can be removed, it is built into most testing utilities like `waitFor`, `.findBy*`, and `@testing-library/user-event`.
- Use `.findBy*` to wait for elements to appear.
- Use `waitFor(...)` to wait for any other expected state changes or multiple elements.
- Use `@testing-library/user-event` for user interactions.
- The `renderHook` API has changes in several ways:
  - It no longer returns `waitForValueToChange` or `waitForNextUpdate`, you'll likely want to use `waitFor` instead.
  - It now throws errors rather than returns them as part of the result.
  - It no longer forwards `initialProps` to the `wrapper`, a workaround for this is provided in the [docs](https://testing-library.com/docs/react-testing-library/api/#renderhook-options-initialprops).
- Waiting for mock functions to be called by a component and then expecting render state to be updated is no longer reliable.
- Rendered components often don't immediately update on user input, it's more common to need to use `waitFor` or other utilities to wait for the expected state to be reached.

You can also refer to the test changes in this [PR](https://github.com/backstage/backstage/pull/20598/files?file-filters%5B%5D=.ts&file-filters%5B%5D=.tsx), which was the migration to React 18 for the Backstage project itself.

Best of luck! For question please join the [community Discord](https://discord.gg/backstage-687207715902193673). If you think this documentation could be improved we welcome you to [open an issue](https://github.com/backstage/backstage/issues/new/choose) or submit a pull request.

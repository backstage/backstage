---
'@backstage/create-app': patch
---

The app template has been updated to add an explicit dependency on `typescript` in the root `package.json`. This is because it was removed as a dependency of `@backstage/cli` in order to decouple the TypeScript versioning in Backstage projects.

To apply this change in an existing app, add a `typescript` dependency to your `package.json` in the project root:

```json
  "dependencies": {
    ...
    "typescript": "~4.5.4",
  }
```

We recommend using a `~` version range since TypeScript releases do not adhere to semver.

It may be the case that you end up with errors if you upgrade the TypeScript version. This is because there was a change to TypeScript not long ago that defaulted the type of errors caught in `catch` blocks to `unknown`. You can work around this by adding `"useUnknownInCatchVariables": false` to the `"compilerOptions"` in your `tsconfig.json`:

```json
  "compilerOptions": {
    ...
    "useUnknownInCatchVariables": false
  }
```

Another option is to use the utilities from `@backstage/errors` to assert the type of errors caught in `catch` blocks:

```ts
import { assertError, isError } from '@backstage/errors';

try {
  ...
} catch (error) {
  assertError(error);
  ...
  // OR
  if (isError(error)) {
    ...
  }
}
```

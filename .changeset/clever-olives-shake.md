---
'@backstage/cli': minor
---

Removed the `typescript` dependency from the Backstage CLI in order to decouple the TypeScript version in Backstage projects. To keep using a specific TypeScript version, be sure to add an explicit dependency in your root `package.json`:

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

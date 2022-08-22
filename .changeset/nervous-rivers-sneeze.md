---
'@backstage/cli': patch
---

Switch out `sucrase` for `swc` for transpilation.

Sucrase is a little more relaxed when it comes to supporting the ways of mocking in Jest. You might have to make some changes to your tests to meet the Jest standard and spec if your tests seems to start failing.

Mocks that look like this are invalid, and they will throw a reference error in line with the Jest documentation [here on example 3](https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter)

```ts
const mockCommandExists = jest.fn();
jest.mock('command-exists', () => mockCommandExists);
```

You might need to update these mocks to look a little like the following to defer the call to the `jest.fn()` spy until the mock is called.

```ts
const mockCommandExists = jest.fn();
jest.mock(
  'command-exists',
  () =>
    (...args: any[]) =>
      commandExists(...args),
);
```

You can also remove any occurences of `hot(App)` and any import of `react-hot-loader` if you're using the that package locally, as all this has now been replaced with [React Refresh](https://www.npmjs.com/package/react-refresh) which you will get out of the box with the new CLI.

**Note** If you're experiencing difficulties with running tests after the migration, please reach out to us on Discord to see if we can help, or raise an issue. But in the meantime you can switch back to the existing behaviour by using the following config in your root `package.json`.

```json
"jest": {
  "transform": {
    "\\.(js|jsx|ts|tsx|mjs|cjs)$": "@backstage/cli/config/jestSucraseTransform.js",
    "\\.(bmp|gif|jpg|jpeg|png|frag|xml|svg|eot|woff|woff2|ttf)$": "@backstage/cli/config/jestFileTransform.js",
    "\\.(yaml)$": "jest-transform-yaml"
  }
}
```

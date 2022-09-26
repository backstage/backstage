---
'@backstage/cli': patch
---

Switch out `sucrase` for `swc` for transpilation.

`sucrase` is a little more relaxed when it comes to supporting the ways of mocking in `jest`. You might have to make some changes to your tests to meet the `jest` standard and spec if your tests seems to start failing.

Mocks that look like this are invalid, and they will throw a reference error in line with the `jest` documentation [here on example 3](https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter)

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

Also, imports are immutable. So it means that you might get some errors when trying to use `jest.spyOn` with starred imports. You might see an error like this:

```log
TypeError: Cannot redefine property: executeFrameHandlerStrategy
        at Function.defineProperty (<anonymous>)

      20 | import { AuthResolverContext } from '../types';
      21 |
    > 22 | const mockFrameHandler = jest.spyOn(
         |                               ^
      23 |   helpers,
      24 |   'executeFrameHandlerStrategy',
      25 | ) as unknown as jest.MockedFunction<
```

This happens when you try to do `import * as something from './something'` and then `jest.spyOn(something, 'test)`. You will need to add a `jest.mock` call to mock out the required starred import to return `jest.fn()` functions from the start. Something like this fixes the above test:

```ts
jest.mock('../../helpers', () => ({
  executeFrameHandlerStrategy: jest.fn(),
}));
```

You can also remove any occurrence of `hot(App)` and any import of `react-hot-loader` if you're using the that package locally, as all this has now been replaced with [React Refresh](https://www.npmjs.com/package/react-refresh) which you will get out of the box with the new CLI.

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

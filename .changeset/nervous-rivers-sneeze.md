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

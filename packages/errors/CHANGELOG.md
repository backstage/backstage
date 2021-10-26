# @backstage/errors

## 0.1.3

### Patch Changes

- 7e97d0b8c1: Add public tags and documentation
- 6077d61e73: Two new helpers have been added that make it easier to migrate to considering thrown errors to be of the type `unknown` in TypeScript. The helpers are `assertError` and `isError`, and can be called to make sure that an unknown value conforms to the shape of an `ErrorLike` object. The `assertError` function is a type-guard that throws in the case of a mismatch, while `isError` returns false.

  A new error constructor has also been added, `ForwardedError`, which can be used to add context to a forwarded error. It requires both a message and a cause, and inherits the `name` property from the `cause`.

## 0.1.2

### Patch Changes

- d1da88a19: Properly export all used types.
- Updated dependencies
  - @backstage/config@0.1.9

# @backstage/errors

## 1.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0

## 1.2.6

### Patch Changes

- 1d4b5b9: Trim `error.cause.stack` in addition to `error.stack` when trimming stack traces from serialized errors.
- Updated dependencies
  - @backstage/types@1.2.0

## 1.2.6-next.0

### Patch Changes

- 1d4b5b9: Trim `error.cause.stack` in addition to `error.stack` when trimming stack traces from serialized errors.
- Updated dependencies
  - @backstage/types@1.2.0

## 1.2.5

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.0

## 1.2.4

### Patch Changes

- 2636075: Fixed an issue that was causing ResponseError not to report the HTTP status from the provided response.
- Updated dependencies
  - @backstage/types@1.1.1

## 1.2.4-next.0

### Patch Changes

- 2636075: Fixed an issue that was causing ResponseError not to report the HTTP status from the provided response.
- Updated dependencies
  - @backstage/types@1.1.1

## 1.2.3

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/types@1.1.1

## 1.2.3-next.0

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/types@1.1.1

## 1.2.2

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/types@1.1.1

## 1.2.2-next.0

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/types@1.1.1-next.0

## 1.2.1

### Patch Changes

- e205b3e6ede8: Set `this.name` in all error classes that extend `CustomErrorBase` class to their actual name
- Updated dependencies
  - @backstage/types@1.1.0

## 1.2.1-next.0

### Patch Changes

- e205b3e6ede8: Set `this.name` in all error classes that extend `CustomErrorBase` class to their actual name
- Updated dependencies
  - @backstage/types@1.1.0

## 1.2.0

### Minor Changes

- c4e8fefd9f13: Added `ServiceUnavailableError`

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0

## 1.2.0-next.0

### Minor Changes

- c4e8fefd9f13: Added `ServiceUnavailableError`

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2

## 1.1.5

### Patch Changes

- 3bf83a2aabf: Added `NotImplementedError`, which can be used when the server does not recognize the request method and is incapable of supporting it for any resource.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.1.5-next.0

### Patch Changes

- 3bf83a2aabf: Added `NotImplementedError`, which can be used when the server does not recognize the request method and is incapable of supporting it for any resource.
- Updated dependencies
  - @backstage/types@1.0.2

## 1.1.4

### Patch Changes

- ac6cc9f7bd: Removed a circular import
- Updated dependencies
  - @backstage/types@1.0.2

## 1.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.1

## 1.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.0

## 1.1.3

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1-next.0

## 1.1.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 1.1.1

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.

## 1.1.1-next.0

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.

## 1.1.0

### Minor Changes

- 6d61b44466: The `ResponseError.fromResponse` now accepts a more narrow response type, in order to avoid incompatibilities between different fetch implementations.

  The `response` property of `ResponseError` has also been narrowed to a new `ConsumedResponse` type that omits all the properties for consuming the body of the response. This is not considered a breaking change as it was always an error to try to consume the body of the response.

### Patch Changes

- c1a8bbf5e5: Inline the type of `ConsumedResponse.headers` and tweaked it to be the intersection of the built-in type and `node-fetch` type.

## 1.1.0-next.0

### Minor Changes

- 6d61b44466: The `ResponseError.fromResponse` now accepts a more narrow response type, in order to avoid incompatibilities between different fetch implementations.

  The `response` property of `ResponseError` has also been narrowed to a new `ConsumedResponse` type that omits all the properties for consuming the body of the response. This is not considered a breaking change as it was always an error to try to consume the body of the response.

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.0

## 0.2.2

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/types@0.1.3

## 0.2.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/types@0.1.2

## 0.2.0

### Minor Changes

- e2eb92c109: Removed the deprecated exports `ErrorResponse` and `parseErrorResponse`.

  Removed the deprecated `constructor` and the deprecated `data` property of `ResponseError`.

## 0.1.5

### Patch Changes

- 4d09c60256: Deprecate `parseErrorResponse` in favour of `parseErrorResponseBody`. Deprecate `data` field inside `ErrorResponse` in favour of `body`.
  Rename the error name for unknown errors from `unknown` to `error`.

## 0.1.4

### Patch Changes

- a15d028517: More API fixes: mark things public, add docs, fix exports
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- 8c30ae8902: Add `stringifyError` that is useful for logging e.g. `Something went wrong, ${stringifyError(e)}`

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

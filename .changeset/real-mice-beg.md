---
'@backstage/errors': patch
---

Two new helpers have been added that make it easier to migrate to considering thrown errors to be of the type `unknown` in TypeScript. The helpers are `assertError` and `isError`, and can be called to make sure that an unknown value conforms to the shape of an `ErrorLike` object. The `assertError` function is a type-guard that throws in the case of a mismatch, while `isError` returns false.

A new error constructor has also been added, `ForwardedError`, which can be used to add context to a forwarded error. It requires both a message and a cause, and inherits the `name` property from the `cause`.

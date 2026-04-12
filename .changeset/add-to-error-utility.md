---
'@backstage/errors': minor
---

A new `toError` utility function is now available for converting unknown values to `ErrorLike` objects. If the value is already error-like it is returned as-is, strings are used directly as the error message, and all other values are wrapped as `unknown error '<stringified>'`. Non-error causes passed to `CustomErrorBase` are now converted and stored using `toError` rather than discarded.

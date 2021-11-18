---
'@backstage/errors': patch
---

Deprecate `parseErrorResponse` in favour of `parseErrorResponseBody`. Deprecate `data` field inside `ErrorResponse` in favour of `body`.
Rename the error name for unknown errors from `unknown` to `error`.

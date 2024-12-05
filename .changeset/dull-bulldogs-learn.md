---
'@backstage/backend-defaults': patch
---

The user and plugin token verification in the default `AuthService` implementation will no longer forward verification errors to the caller, and instead log them as warnings.

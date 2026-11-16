---
'@backstage/repo-tools': patch
---

The `package schema openapi generate` command now exits with a non-zero code when client or server generation fails, for example when linting the generated code fails. Previously the failure was logged but the command still exited with code 0. Watch mode is unaffected and keeps watching after a failed generation.

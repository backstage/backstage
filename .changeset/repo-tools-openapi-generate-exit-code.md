---
'@backstage/repo-tools': patch
---

The `package schema openapi generate` command now exits with an error code when client or server generation fails, instead of logging the error and exiting successfully. Server generation is also faster, since it now lints and formats the generated files in a single pass.

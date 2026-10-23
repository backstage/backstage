---
'@backstage/repo-tools': patch
---

The `package schema openapi generate` command now exits with an error code when client or server generation fails, instead of logging the error and exiting successfully. This includes the case where linting the generated code fails, so projects with a lint configuration that can't run during generation will now see the command fail. The generated files are still formatted before the command fails. Server generation no longer fails in projects without Prettier, and it's also faster, since it now lints and formats the generated files in a single pass.

---
'@backstage/repo-tools': patch
---

The `package schema openapi generate` command now exits with an error code when client or server generation fails, instead of logging the error and exiting successfully. A failure to apply lint fixes to the generated code is reported as a warning and doesn't fail the command. The command also no longer needs Yarn to run the Backstage CLI, and server generation no longer fails in projects without Prettier. Server generation is also faster, since it now lints and formats the generated files in a single pass.

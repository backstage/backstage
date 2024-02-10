---
'@backstage/repo-tools': minor
---

**BREAKING**: The `schema openapi *` commands are now renamed into `package schema openapi *` and `repo schema openapi *`. The aim is to make it more clear what the command is operating on, the entire repo or just a single package.

The following commands now live under the `package` namespace,

- `schema openapi generate` is now `package schema openapi generate --server`
- `schema openapi generate-client` is now `package schema openapi generate --client-package`
- `schema openapi init` is now `package schema openapi init`

And these commands live under the new `repo` namespace,

- `schema openapi lint` is now `repo schema openapi lint`
- `schema openapi test` is now `repo schema openapi test`
- `schema openapi verify` is now `repo schema openapi verify`

The `package schema openapi generate` now supports defining both `--server` and `--client-package` to generate both at once.This update also reworks the `--client-package` flag to accept only an output directory as the input directory can now be inferred.

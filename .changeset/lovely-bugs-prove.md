---
'@backstage/repo-tools': minor
---

Renames the `schema openapi *` commands into `package schema openapi *` and `repo schema openapi *`. The aim is to make it more clear what the command is operating on, the entire repo or just a single package.

The following commands now live under the `package` namespace,

- `schema openapi generate` is now `package schema openapi generate server`
- `schema openapi generate-client` is now `package schema openapi generate client`
- `schema openapi init` is now `package schema openapi init`

And these commands live under the new `repo` namespace,

- `schema openapi lint` is now `repo schema openapi lint`
- `schema openapi test` is now `repo schema openapi test`
- `schema openapi verify` is now `repo schema openapi verify`

This also reworks the `package schema openapi generate client` to accept only an output directory as the input directory can now be inferred.

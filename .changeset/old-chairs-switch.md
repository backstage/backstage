---
'@backstage/repo-tools': minor
---

Adds a new command `schema openapi test` that performs runtime validation of your OpenAPI specs using your test data. Under the hood, we're using Optic to perform this check, really cool work by them!

To use this new command, you will have to run `yarn add @useoptic/optic` in the root of your repo.

---
'@backstage/repo-tools': minor
---

**BREAKING**: Replaced `@useoptic/optic` and `@useoptic/openapi-utilities` with `oasdiff` for OpenAPI breaking change detection.

To migrate, remove `@useoptic/optic` from your root `package.json` and install the `oasdiff` CLI on your system — see https://github.com/oasdiff/oasdiff#installation for instructions.

The `package schema openapi diff` command now uses `oasdiff` under the hood. The `--since`, `--json`, and `--ignore` flags continue to work, but the JSON and text output formats have changed to match `oasdiff`'s native output.

The `repo schema openapi diff` command now automatically detects all packages with a changed `src/schema/openapi.yaml` and runs `oasdiff` against them directly. Packages no longer need a `"diff"` script in their `package.json` to be included in the check.

Removed the `package schema openapi init` and `repo schema openapi test` commands, which depended on the Optic `capture` workflow and have no equivalent with `oasdiff`. Runtime validation of your API against its OpenAPI spec is still available via `wrapServer` from `@backstage/backend-openapi-utils/testUtils`.

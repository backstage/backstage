---
'@backstage/cli-module-oxlint': patch
---

Added `@backstage/cli-module-oxlint` as an opt-in alternative to ESLint for the Backstage CLI's `package lint` and `repo lint` commands. The module includes native Oxlint configuration for Backstage package roles and Backstage-specific import checks, without changing the ESLint plugin or translating ESLint configuration.

The default `backstage` preset enables correctness checks. The optional `strict` preset adds type checking, explained-suppression validation, and restrictions on React and Winston default or namespace imports and non-locale case conversion. Both commands support automatic fixes, warning thresholds, and lint reports; warning thresholds apply across the whole run, and repository linting honors `--max-warnings` values from package lint scripts. Config groups lint concurrently. Repository linting also supports selecting changed packages with `--since`. Success-cache flags are accepted for script compatibility but do not enable caching. Checkstyle and JUnit reports require a single configuration group; a run with no groups writes an empty report. Linting fails for packages that have no Oxlint configuration, rather than silently running without the Backstage rules.

Requires Node.js 22.12 or later in the supported Node 22 or 24 release lines. See the package README for configuration, supported report formats, and adoption guidance.

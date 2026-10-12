---
'@backstage/cli-module-oxlint': patch
---

Added `@backstage/cli-module-oxlint` as an opt-in alternative to ESLint for the Backstage CLI's `package lint` and `repo lint` commands. The module includes native Oxlint configuration for Backstage package roles and Backstage-specific import checks, without changing the ESLint plugin or translating ESLint configuration.

The default `backstage` preset enables correctness checks. The optional `agentic` preset adds stricter checks, type checking, and validation of explained suppression comments. Both commands support autofixes, warning thresholds, and lint reports; repository linting also supports selecting changed packages with `--since`. Success-cache flags are accepted for script compatibility but do not enable caching. Checkstyle and JUnit reports require a single configuration group.

Requires Node.js 22.12 or later in the supported Node 22 or 24 release lines. See the package README for configuration, supported report formats, and adoption guidance.

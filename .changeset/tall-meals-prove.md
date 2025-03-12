---
'@backstage/cli': minor
---

**BREAKING**: ESLint warnings no longer trigger system exit codes like errors do.

Set the max number of warnings to `-1` during linting to enable the gradual adoption of new ESLint rules. To restore the previous behavior, include the `--max-warnings 0` flag in the `backstage-cli <repo|package> lint` command.

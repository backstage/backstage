---
'@backstage/cli': patch
---

Migrated remaining CLI command handlers from `commander` to `cleye` for argument parsing. Several camelCase CLI flags have been deprecated in favor of their kebab-case equivalents (e.g. `--successCache` → `--success-cache`). The old camelCase forms still work but will now log a deprecation warning. Please update any scripts or CI configurations to use the kebab-case versions.

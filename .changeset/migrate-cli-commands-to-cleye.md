---
'@backstage/cli': patch
---

Migrated remaining CLI command handlers from `commander` to `cleye` for argument parsing. CLI flags are now displayed in kebab-case in help output (e.g. `--success-cache` instead of `--successCache`), but both forms are accepted transparently — no changes needed in existing scripts or CI configurations.

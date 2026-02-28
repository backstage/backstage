---
'@backstage/cli': patch
---

Migrated remaining CLI command handlers from `commander` to `cleye` for argument parsing. A few CLI flags that were previously camelCase have been normalized to kebab-case to match standard CLI conventions. Affected flags: `--baseVersion` → `--base-version`, `--successCache` → `--success-cache`, `--successCacheDir` → `--success-cache-dir`, `--alwaysPack` → `--always-pack`.

---
'@backstage/cli': patch
---

Migrated remaining CLI command handlers from `commander` to `cleye` for argument parsing. The following CLI flags have been renamed from camelCase to kebab-case to match standard CLI conventions:

- `--baseVersion` → `--base-version`
- `--successCache` → `--success-cache`
- `--successCacheDir` → `--success-cache-dir`
- `--alwaysPack` → `--always-pack`
- `--alwaysYarnPack` → `--always-pack` (hidden legacy alias preserved)

The old camelCase flag names still work but will print a deprecation warning. Please update any scripts or CI configurations to use the new kebab-case spelling.

---
'@backstage/cli': minor
---

**BREAKING**: Migrated remaining CLI command handlers from `commander` to `cleye` for argument parsing. The following CLI flags have been renamed from camelCase to kebab-case to match standard CLI conventions:

- `--baseVersion` → `--base-version`
- `--successCache` → `--success-cache`
- `--successCacheDir` → `--success-cache-dir`
- `--alwaysPack` → `--always-pack`
- `--alwaysYarnPack` → `--always-pack` (hidden legacy alias preserved)

If you have scripts or CI configurations that use any of the above flags, update them to the new kebab-case spelling.

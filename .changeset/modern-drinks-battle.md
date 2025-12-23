---
'@backstage/ui': minor
---

**Breaking** Updating color tokens to match the new neutral style on different surfaces.

## Migration notes

There's no direct replacement for the old tint tokens but you can use the new neutral set of color tokens on surface 0 or 1 as a replacement.

- `--bui-bg-tint` can be replaced by `--bui-bg-neutral-on-surface-0`
- --bui-bg-tint-hover can be replaced by `--bui-bg-neutral-on-surface-0-hover`
- --bui-bg-tint-pressed can be replaced by `--bui-bg-neutral-on-surface-0-pressed`
- --bui-bg-tint-disabled can be replaced by `--bui-bg-neutral-on-surface-0-disabled`

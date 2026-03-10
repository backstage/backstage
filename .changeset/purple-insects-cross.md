---
'@backstage/plugin-devtools': patch
---

Migrated `ConfigContent` component from Material UI to Backstage UI (BUI).

Replaced MUI components with their BUI equivalents:

- `Box`, `Paper` → `Box` with `bg` and `p` props
- `Typography` → `Text` with `as="p"`
- `Alert` → `Alert` with `status` and `title` props
- Removed `makeStyles`/`createStyles` in favor of BUI spacing props

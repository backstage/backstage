---
'@backstage/ui': minor
---

**BREAKING:** Renamed, added, and removed CSS tokens.

- Renamed `--bui-bg-neutral-0` to `--bui-bg-app`.
- Renamed `--bui-border` to `--bui-border-2`.
- Added `--bui-border-1` for subtle, low-contrast borders.
- Added `--bui-bg-popover` for the background color of popovers, tooltips, menus, and dialogs.
- Removed `--bui-border-hover`, `--bui-border-pressed`, and `--bui-border-disabled`.

**Migration:**

```diff
- var(--bui-bg-neutral-0)
+ var(--bui-bg-app)

- var(--bui-border)
+ var(--bui-border-2)
```

Remove any references to `--bui-border-hover`, `--bui-border-pressed`, and `--bui-border-disabled` as these tokens no longer exist.

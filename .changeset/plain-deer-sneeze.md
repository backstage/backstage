---
'@backstage/ui': minor
---

**BREAKING:** Renamed and removed CSS tokens.

- Renamed `--bui-bg-neutral-0` to `--bui-bg-app`.
- Renamed `--bui-border` to `--bui-border-2`.
- Removed `--bui-border-hover`, `--bui-border-pressed`, and `--bui-border-disabled`.

**Migration:**

```diff
- var(--bui-bg-neutral-0)
+ var(--bui-bg-app)

- var(--bui-border)
+ var(--bui-border-2)
```

Remove any references to `--bui-border-hover`, `--bui-border-pressed`, and `--bui-border-disabled` as these tokens no longer exist.

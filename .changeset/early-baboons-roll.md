---
'@backstage/ui': minor
---

**BREAKING**: Removed `--bui-bg-popover` CSS token. Popover, Tooltip, Menu, and Dialog now use `--bui-bg-app` for their outer shell and `Box bg="neutral-1"` for content areas, providing better theme consistency and eliminating a redundant token.

**Migration:**

Replace any usage of `--bui-bg-popover` with `--bui-bg-neutral-1` (for content surfaces) or `--bui-bg-app` (for outer shells):

```diff
- background: var(--bui-bg-popover);
+ background: var(--bui-bg-neutral-1);
```

**Affected components:** Popover, Tooltip, Menu, Dialog

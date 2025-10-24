---
'@backstage/ui': minor
---

**BREAKING**: Migrated Avatar component from Base UI to custom implementation with size changes:

- Base UI-specific props are no longer supported
- Size values have been updated:
  - New `x-small` size added (1.25rem / 20px)
  - `small` size unchanged (1.5rem / 24px)
  - `medium` size unchanged (2rem / 32px, default)
  - `large` size **changed from 3rem to 2.5rem** (40px)
  - New `x-large` size added (3rem / 48px)

Migration:

```diff
# Remove Base UI-specific props
- <Avatar src="..." name="..." render={...} />
+ <Avatar src="..." name="..." />

# Update large size usage to x-large for same visual size
- <Avatar src="..." name="..." size="large" />
+ <Avatar src="..." name="..." size="x-large" />
```

Added `purpose` prop for accessibility control (`'informative'` or `'decoration'`).

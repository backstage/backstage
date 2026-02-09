---
'@backstage/ui': minor
---

**BREAKING**: Removed gray scale tokens and renamed background surface tokens to neutral tokens

The `--bui-gray-1` through `--bui-gray-8` tokens have been removed. The `--bui-bg-surface-*` and `--bui-bg-neutral-on-surface-*` tokens have been replaced by a unified `--bui-bg-neutral-*` scale.

**Migration:**

Replace surface tokens directly:

```diff
- background: var(--bui-bg-surface-0);
+ background: var(--bui-bg-neutral-0);
```

Replace on-surface tokens shifted by +1:

```diff
- background: var(--bui-bg-neutral-on-surface-0);
+ background: var(--bui-bg-neutral-1);
```

Replace gray tokens 1-4 with neutral equivalents (`--bui-gray-5` through `--bui-gray-8` have no direct replacement):

```diff
- background: var(--bui-gray-1);
+ background: var(--bui-bg-neutral-1);
```

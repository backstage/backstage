---
'@backstage/ui': minor
---

**BREAKING**: Removed `large` size variant from Button component as it was never implemented.

**Migration:**

```diff
- <Button size="large">Click me</Button>
+ <Button size="medium">Click me</Button>
```

**Affected components:** Button

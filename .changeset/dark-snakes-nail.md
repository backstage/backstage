---
'@backstage/ui': minor
---

**BREAKING**: Simplified the neutral background prop API for container components. The explicit `neutral-1`, `neutral-2`, `neutral-3`, and `neutral-auto` values have been removed from `ProviderBg`. They are replaced by a single `'neutral'` value that always auto-increments from the parent context, making it impossible to skip or pin to an explicit neutral level.

**Migration:**

Replace any explicit `bg="neutral-1"`, `bg="neutral-2"`, `bg="neutral-3"`, or `bg="neutral-auto"` props with `bg="neutral"`. To achieve a specific neutral level in stories or tests, use nested containers — each additional `bg="neutral"` wrapper increments by one level.

```tsx
// Before
<Box bg="neutral-2">...</Box>

// After
<Box bg="neutral">
  <Box bg="neutral">...</Box>
</Box>
```

**Affected components:** Box, Flex, Grid, Card, Accordion, Popover, Tooltip, Dialog, Menu

---
'@backstage/ui': minor
---

This adds a new automated way for components to understand on what surface they are in Backstage UI. `Box`, `Flex`, and `Grid` will now have `bg` prop and a provider that will connect with any components inside to adapt their styling.

Here's an example:

```tsx
// If a Button is inside of a Box that has a set background value, then the Button will automatically adapt its style.
<Box bg="surface-1">
  <Button>Hello World</Button>
</Box>
```

**Breaking change** This update underlying background color tokens. Here's a breakdown of the updates:

```diff
- --bui-bg-tint              No replacement
- --bui-bg-tint-hover        No replacement
- --bui-bg-tint-pressed      No replacement
- --bui-bg-tint-disabled     No replacement
- --bui-bg                   To be replaced by --bui-bg-surface-0

+ --bui-bg-surface-0

+ --bui-bg-on-surface-0
+ --bui-bg-hover-on-surface-0
+ --bui-bg-pressed-on-surface-0
+ --bui-bg-disabled-on-surface-0

+ --bui-bg-on-surface-1
+ --bui-bg-hover-on-surface-1
+ --bui-bg-pressed-on-surface-1
+ --bui-bg-disabled-on-surface-1

+ --bui-bg-on-surface-2
+ --bui-bg-hover-on-surface-2
+ --bui-bg-pressed-on-surface-2
+ --bui-bg-disabled-on-surface-2
```

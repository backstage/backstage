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

**Breaking change** Updated Backstage UI `--bui-bg` token to be `--bui-bg-surface-0`.

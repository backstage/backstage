---
'@backstage/ui': patch
---

Added a new `FullPage` component that fills the remaining viewport height below the `Header`.

```tsx
<Header title="My Plugin" tabs={tabs} />
<FullPage>
  {/* content fills remaining height */}
</FullPage>
```

**Affected components:** FullPage

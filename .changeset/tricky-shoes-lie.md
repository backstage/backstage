---
'@backstage/plugin-catalog-graph': patch
---

Added InfoCard `action` attribute for CatalogGraphCard

```tsx
const action = <Button title="Action Button" onClick={handleClickEvent()} />
<CatalogGraphCard action={action} />
```

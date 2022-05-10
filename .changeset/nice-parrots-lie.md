---
'@backstage/plugin-techdocs-react': patch
---

Create a new addon location called "Settings", it is designed for addons that allow users to customize the reading experience in documentation pages.

Usage example:

```tsx
const TextSize = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension({
    name: 'TextSize',
    location: TechDocsAddonLocations.Settings,
    component: TextSizeAddon,
  }),
);
```

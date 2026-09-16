---
'@backstage/plugin-techdocs': patch
---

Fixed TechDocs reader addons not rendering: the addon registry is now rendered inside the router outlet so `useTechDocsAddons` can see it.

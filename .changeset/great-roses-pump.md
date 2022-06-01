---
'@backstage/plugin-catalog': patch
---

Previously, the color of the Entity Context Menu (in the Entity Page Header) was hardcoded as 'white'. This was an issue for themes that use a header with a white background. The color of the icon can now be overriden in the theme (PluginCatalogEntityContextMenu > button > color).

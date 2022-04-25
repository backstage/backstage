---
'@backstage/plugin-techdocs-react': patch
'@backstage/plugin-techdocs-module-addons-contrib': patch
---

Updated the return type of `createTechDocsAddonExtension` to better reflect the fact that passing children to Addon components is not a valid use-case.

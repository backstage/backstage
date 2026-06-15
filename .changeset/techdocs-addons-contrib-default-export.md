---
'@backstage/plugin-techdocs-module-addons-contrib': patch
---

Added a default export to the `/alpha` entrypoint that bundles all contributed TechDocs addon modules using `createFrontendFeatureLoader`. This allows the package to be loaded as a single feature in setups that discover frontend modules through their default export, such as dynamic plugin loaders.

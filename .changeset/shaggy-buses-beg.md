---
'@backstage/plugin-catalog-react': minor
---

The `UserListPicker` component has undergone improvements to enhance its performance.

The previous implementation inferred the number of owned and starred entities based on the entities available in the `EntityListContext`. The updated version no longer relies on the `EntityListContext` for inference, allowing for better decoupling.

The component now loads the entities' count asynchronously, resulting in improved performance and responsiveness. For this purpose, some of the exported filters such as `EntityTagFilter`, `EntityOwnerFilter`, `EntityLifecycleFilter` and `EntityNamespaceFilter` have now the `getCatalogFilters` method implemented.

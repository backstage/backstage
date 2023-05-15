---
'@backstage/plugin-catalog-react': patch
---

The `EntityOwnerPicker` component has undergone improvements to enhance its performance.

The component now loads entities asynchronously, resulting in improved performance and responsiveness. Instead of loading all entities upfront, they are now loaded in batches as the user scrolls.
The previous implementation inferred users and groups displayed by the `EntityOwnerPicker` component based on the entities available in the `EntityListContext`. The updated version no longer relies on the `EntityListContext` for inference, allowing for better decoupling and improved performance.

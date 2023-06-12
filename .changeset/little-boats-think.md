---
'@backstage/plugin-catalog-react': minor
---

The `EntityOwnerPicker` component has undergone improvements to enhance its performance.
The previous implementation inferred users and groups displayed by the `EntityOwnerPicker` component based on the entities available in the `EntityListContext`. The updated version no longer relies on the `EntityListContext` for inference, allowing for better decoupling and improved performance.

The component now loads entities asynchronously, resulting in improved performance and responsiveness. A new `mode` prop has been introduced which provides two different behaviours:

- `<EntityOwnerPicker mode="owners-only" />`: loads the owners data asynchronously using the facets endpoint. The data is kept in memory and rendered asynchronously as the user scrolls. This is the default mode and is supposed to be retro-compatible with the previous implementation.

- `<EntityOwnerPicker mode="all" />` loads all users and groups present in the catalog asynchronously. The data is loaded in batches as the user scrolls. This is more efficient than `owners-only`, but has the drawback of displaying users and groups who aren't owner of any entity.

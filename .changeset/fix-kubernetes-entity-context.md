---
'@backstage/plugin-catalog-react': patch
'@backstage/plugin-kubernetes': patch
---

Added `useEntityOptional` hook that returns `undefined` instead of throwing
when called outside of an `EntityProvider`. Fixed `KubernetesContentPage` to
use `useEntityOptional` to prevent the "Entity context is not available" error
in the new frontend system, where `EntityContentBlueprint` loaders are
evaluated outside of `EntityProvider` when building sidebar/nav items.

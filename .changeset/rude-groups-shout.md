---
'@backstage/ui': patch
---

Improved type safety in `useDefinition` by centralizing prop resolution and strengthening the `BgPropsConstraint` to require that `bg` provider components declare `children` as a required prop in their OwnProps type.

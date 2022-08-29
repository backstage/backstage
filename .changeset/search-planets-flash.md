---
'@backstage/plugin-search': patch
---

Add `userParentContext` prop to the `SearchContextProvider`, this added property does not create a local context and consumes the parent if it already exists.

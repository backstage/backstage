---
'@backstage/plugin-search': patch
---

Use the new `inheritParentContextIfAvailable` search context property in `SearchModal` instead of manually checking if a parent context exists, this conditional statement was previously duplicated in more than one component like in `SearchBar` as well and is now only done in ` SearchContextProvider`.

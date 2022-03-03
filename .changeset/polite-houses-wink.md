---
'@backstage/plugin-catalog-react': patch
---

- **BREAKING**: The `isOwnerOf` function has been marked as `@alpha` and is now only available via the `@backstage/plugin-catalog-react/alpha` import. The limitations of this function with regards to only supporting direct relations have also been documented.

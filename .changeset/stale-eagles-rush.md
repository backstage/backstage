---
'@backstage/frontend-plugin-api': patch
'@backstage/core-plugin-api': patch
---

Reversed the relationship between the old `@backstage/core-plugin-api` and the new `@backstage/frontend-plugin-api`. Previously, the a lot of API definitions and utilities where defined in the old and re-exported from the old, but this change flips that around so that they now reside in the new package and are re-exported from the old. The external API of both packages remain the same, but this is a step towards being able to add further compatibility with the new frontend system built into the old.

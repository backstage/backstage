---
'@backstage/plugin-catalog': minor
---

Entity page tabs now honor explicit `inputs.contents.order` configuration on `page:catalog/entity` instead of alphabetical content sorting, while retaining tab groups. Without an explicit input order, existing sorting behavior is unchanged.

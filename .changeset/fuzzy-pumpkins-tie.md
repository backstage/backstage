---
'@backstage/catalog-model': patch
---

Adds a new optional `links` metadata field to the Entity class within the `catalog-model` package (as discussed in [[RFC] Entity Links](https://github.com/backstage/backstage/issues/3787)). This PR adds support for the entity links only. Follow up PR's will introduce the UI component to display them.

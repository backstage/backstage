---
'@backstage/plugin-catalog': minor
---

Added an opt-in v2 implementation of the catalog index page that uses the `@backstage/ui` table and supports columns contributed by frontend plugins and modules through `CatalogColumnBlueprint`. Enable it by setting `version: 'v2'` on `page:catalog` in your app config. Six default columns ship out of the box (name, owner, type, lifecycle, description, tags); each can be hidden via `catalog-column:catalog/<id>` config. The legacy v1 page remains the default and is unchanged.

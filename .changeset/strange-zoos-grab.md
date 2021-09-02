---
'@backstage/catalog-model': patch
---

Add an optional `metadata.title` field to all entity kinds.

This used to be available on only the `Template` kind, and we have decided that the metadata block should be the same for all kinds. A title can be useful especially in large and complex catalogs where users have a tough time navigating or discerning among the entities.

It also carries some risk. You do not want to end up giving a title that collides with an actual name, which at best leads to confusion and at worst could be a liability. We do not perform any collision detection in the catalog. If you want to disallow this facility you may want to add a small processor that makes sure it's not set.

At the time of writing this message, only the scaffolder actually makes use of this field for display purposes.

---
'@backstage/plugin-catalog-backend': minor
---

Removed the long-deprecated `DefaultCatalogCollatorFactory` and `DefaultCatalogCollatorFactoryOptions` exports, which now no longer exist in the search plugin's offerings. If you were using these, you want to migrate to [the new backend system](https://backstage.io/docs/backend-system/) and use the [catalog collator](https://backstage.io/docs/features/search/collators#catalog) directly.

---
'@backstage/plugin-techdocs': minor
---

The TechDocs reader page now follows entity renames declared with the `backstage.io/former-names` annotation. When you open a docs URL that uses a former entity name, the reader redirects to the same page and anchor under the current entity and shows a dismissible notice about the rename. Names that cannot be resolved to a single current entity still show the not-found page.

---
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-backend': patch
---

Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

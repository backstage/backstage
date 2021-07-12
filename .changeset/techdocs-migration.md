---
'@backstage/plugin-techdocs': minor
---

Added a `migrateDocsCase()` method to TechDocs publishers, along with
implementations for AWS, Azure, and GCS.

This change is in support of a future update to TechDocs that will allow for
case-insensitive entity triplet URL access to documentation pages which will
require a migration of existing documentation objects in external storage
solutions.

See [#4367](https://github.com/backstage/backstage/issues/4367) for details.

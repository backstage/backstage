---
'@backstage/plugin-techdocs-common': patch
---

Added a `techdocs.entity.read` permission, which allows access to documentation to be controlled separately from access to the catalog entity it belongs to.

Also added a well-known `backstage.io/techdocs-visibility` annotation that can be used to mark an entity's documentation as restricted. The annotation is only a signal — your permission policy decides what it means — so documentation stays open by default and only the entities you tag are affected.

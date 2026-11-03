---
'@backstage/plugin-scaffolder': patch
---

Fixed the `EntityPicker` field in the experimental `bui` form theme so that emptying its input clears the selected entity, and so that text left in the input after leaving the field always matches the selected entity. Previously a selected entity could not be removed again when `allowArbitraryValues` was `false`.

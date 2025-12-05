---
'@backstage/repo-tools': patch
---

Updates OpenAPI generator templates to preserve original property names (like 'group-name', 'user-id') from OpenAPI specs when propertyNaming=original is specified. Previously, these were always converted to camelCase regardless of the propertyNaming setting.

- Updates modelGeneric.mustache templates in both client and server generators
- Updates modelTaggedUnion.mustache templates in both client and server generators
- Uses {{baseName}} when available, falls back to {{name}} for backward compatibility
- Maintains backward compatibility - no changes when propertyNaming=original is not used

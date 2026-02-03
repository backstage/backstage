---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed type support for multiple attachment points in the `ExtensionDefinitionAttachTo` type. Extensions can no longer specify an array of attachment points in the `attachTo` property.

The runtime still supports multiple attachment points for backward compatibility with existing compiled code, but new code will receive type errors if attempting to use this pattern.

Extensions that previously used multiple attachment points should migrate to using a Utility API pattern instead. See the [Sharing Extensions Across Multiple Locations](https://backstage.io/docs/frontend-system/architecture/27-sharing-extensions) guide for the recommended approach.

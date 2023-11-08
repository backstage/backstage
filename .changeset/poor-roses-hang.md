---
'@backstage/core-components': patch
---

Make the `options.titleFormat` prop of `<StructuredMetadataTable />` apply to all keys including nested ones. Previously, this option would only apply to the root keys of the `metadata` prop.

Document and improve the props of `<StructuredMetadataTable />`. Previously, the `options` prop was `any`.

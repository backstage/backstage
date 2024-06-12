---
'@backstage/backend-plugin-api': patch
---

In tests, return `null` rather than throwing an error when trying to get the `ExtensionPoint.T` property, so that tests asserting the property are not easily broken.

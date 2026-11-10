---
'@backstage/plugin-api-docs': patch
---

The AsyncAPI definition widget no longer resolves external references by default. References to whole external documents still render, with a placeholder naming the document that was not loaded; references that point into an external document (using a `#` fragment) fail to render with an error naming the reference. To resolve external references — for example to reach internal schema registries that require authentication — provide the `resolvers` prop to enable external reference resolution.

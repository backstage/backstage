---
'@backstage/core-components': minor
---

The syntax highlighting library used by the `CodeSnippet` component is now lazy loaded. This most likely has no effect on existing code, but may break tests as the content of the `CodeSnippet` is now rendered asynchronously.

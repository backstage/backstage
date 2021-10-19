---
'@backstage/core-components': patch
---

Switched to relying on the built-in support for async loading in `react-syntax-highlighter`. This should provide further improvements to async rendering and lazy loading, and avoid test flakiness that was happening because of the significant number or resources being loaded in lazily all at once.

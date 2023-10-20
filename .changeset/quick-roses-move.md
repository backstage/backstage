---
'@backstage/dev-utils': patch
'@backstage/plugin-techdocs': patch
---

Switched the conditional `react-dom/client` import to use `import(...)` rather than `require(...)`.

---
'@backstage/integration': patch
'@backstage/backend-defaults': patch
'@backstage/backend-dynamic-feature-service': patch
'@backstage/core-components': patch
'@backstage/repo-tools': patch
---

Fixed lodash named-import from breaking ESM consumers importing from the package's `import` exports-map condition.

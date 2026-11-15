---
'@backstage/cli-module-new': patch
---

Templates now depend on `@testing-library/react` 16 together with `@testing-library/dom` 10, which React Testing Library 16 requires as a peer dependency and which matches `@backstage/frontend-test-utils`.

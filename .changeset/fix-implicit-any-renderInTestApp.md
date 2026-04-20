---
'@backstage/frontend-test-utils': patch
---

Added explicit type annotations to `.map()` callback parameters in `renderInTestApp` to avoid implicit `any` errors with newer TypeScript versions.

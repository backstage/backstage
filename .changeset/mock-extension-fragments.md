---
'@backstage/frontend-test-utils': patch
---

Added experimental fragment test helpers in `@backstage/frontend-test-utils/next`. Use `mockApis.extensionFragments()` to provide React elements keyed by fragment ID, with an empty registry by default, or `mockApis.extensionFragments.mock()` for Jest assertions on lookup calls.

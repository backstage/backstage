---
'@backstage/plugin-catalog-react': patch
---

In the new frontend system, `EntityRefLink` now resolves its target from the app's registered entity route, and its href includes the app's deploy base path. Entity links rendered inside a page that uses a different routing library now work, and middle-clicking one or copying its address under a sub-path deployment lands on the right entity. Links retain native browsing targets and downloads, and honor `reloadDocument`, `replace` and navigation state. Old frontend navigation continues to use React Router.

`createTestEntityPage` supplies the same routing adapter as the catalog entity page, so attached entity content sees matching routing behavior in tests.

---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: `renderInTestApp` and `renderTestApp` now throw when the test app has errors that would replace a real app with its error page, such as `API_FACTORY_CONFLICT`. Previously these errors were ignored, so a test could pass for an app that cannot start. Warnings that a real app only logs, such as `EXTENSION_IGNORED`, are still ignored.

**Migration:** fix the reported error in the test setup, for example by removing an API that is also provided by its owning plugin.

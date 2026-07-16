---
'@backstage/cli-module-build': patch
---

Package preparation for publishing validates TypeScript configuration schemas strictly, preventing invalid schemas from being published. Other build and bundle paths report schema errors as warnings.

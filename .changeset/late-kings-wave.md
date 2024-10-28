---
'@backstage/cli': patch
---

Added a new `"rejectFrontendNetworkRequests"` configuration flag that can be set in the `"jest"` field in the root `package.json`:

```json
{
  "jest": {
    "rejectFrontendNetworkRequests": true
  }
}
```

This flag causes rejection of any form of network requests that are attempted to be made in frontend or common package tests. This flag can only be set in the root `package.json` and can not be overridden in individual package configurations.

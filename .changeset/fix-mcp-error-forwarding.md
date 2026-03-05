---
'@backstage/backend-defaults': patch
'@backstage/backend-test-utils': patch
'@backstage/plugin-mcp-actions-backend': patch
---

Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.

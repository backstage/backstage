---
'@backstage/plugin-permission-common': minor
---

**BREAKING**: Authorize API request and response types have been updated. The existing `AuthorizeRequest` and `AuthorizeResponse` types now match the entire request and response objects for the /authorize endpoint, and new types `AuthorizeQuery` and `AuthorizeDecision` have been introduced for individual items in the request and response batches respectively.

**BREAKING**: PermissionClient has been updated to use the new request and response format in the latest version of @backstage/permission-backend.

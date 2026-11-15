---
'@backstage/backend-openapi-utils': patch
---

Fixed response validation so that an empty response body for a JSON response now reports that the body is required but missing, instead of failing with a JSON parse error when the response schema declares required properties.

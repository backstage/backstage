---
'@backstage/backend-app-api': patch
---

Updated the default error handling middleware to filter out certain known error types that should never be returned in responses. The errors are instead logged along with a correlation ID, which is also returned in the response. Initially only PostgreSQL protocol errors from the `pg-protocol` package are filtered out.

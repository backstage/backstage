---
'@backstage/backend-app-api': patch
---

Introduced built-in middleware into the default `HttpService` implementation that throws a `ServiceNotAvailable` error when plugins aren't able to serve request. Also introduced a request stalling mechanism that pauses incoming request until plugins have been fully initialized.

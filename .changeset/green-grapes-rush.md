---
'@backstage/core-app-api': patch
---

Make sure fetch request to the authentication providers includes credentials. As mentioned in the
[HTTP CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials) docs,
the `credentials: include` might not be enough and browsers can reject it if the header
`Access-Control-Allow-Credentials` is not explicitly set to `true`.

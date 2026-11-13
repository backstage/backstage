---
'@backstage/repo-tools': minor
---

**BREAKING**: Generated OpenAPI clients now include separate `DefaultApiFrontendClient`, `DefaultApiBackendClient` and `DefaultApiIsomorphicClient` classes instead of a single `DefaultApiClient`. The frontend client sends requests to `plugin://` URLs that the app's `FetchApi` resolves, the backend client uses the discovery and auth services and requires the credentials to make each request on behalf of, and the isomorphic client keeps the previous discovery and fetch based behavior. To migrate, regenerate your client and switch from `DefaultApiClient` to `DefaultApiIsomorphicClient` for an unchanged setup.

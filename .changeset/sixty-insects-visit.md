---
'@backstage/core-app-api': minor
---

The `AuthConnector` interface now supports specifying a set of scopes when
refreshing a session. The `DefaultAuthConnector` implementation passes the
`scope` query parameter to the auth-backend plugin appropriately. The
`RefreshingAuthSessionManager` passes any scopes in its `GetSessionRequest`
appropriately.

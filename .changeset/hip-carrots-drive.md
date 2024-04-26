---
'@backstage/backend-app-api': patch
---

The default `TokenManager` implementation no longer requires keys to be configured in production, but it will throw an errors when generating or authenticating tokens. The default `AuthService` implementation will now also provide additional context if such an error is throw when falling back to using the `TokenManager` service to generate tokens for outgoing requests.

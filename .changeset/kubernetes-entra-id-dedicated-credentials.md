---
'@backstage/plugin-kubernetes-backend': minor
---

The new Microsoft Entra ID provider reads its configuration from `kubernetes.auth.providers.microsoft.<env>`, where `<env>` is the value of `kubernetes.auth.environment` (default `development`). This backend-only block holds the Entra ID application's `tenantId`, `clientId`, and `clientSecret`, plus a default `scope`. You can reuse the application from the Microsoft sign-in provider, or register a dedicated one to keep user sign-in separate from Kubernetes backend authentication.

The backend only requests a token when the scope and the cluster hostname match an entry in `allowedScopes`, a list that pairs each allowed scope with the cluster hostname patterns it may be sent to. This is a security measure. Anyone who can register a `kubernetes-cluster` catalog entity controls its URL and scope annotation, so without the list the backend would send the Entra ID application's token to a server they control, where it could be replayed against your clusters. The default `scope` must be listed too, and no token is issued if the list is missing. An empty scope, or one with invalid characters, fails with a descriptive error.

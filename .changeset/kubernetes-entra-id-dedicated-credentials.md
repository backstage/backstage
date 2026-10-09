---
'@backstage/plugin-kubernetes-backend': minor
---

The Kubernetes Microsoft Entra Id integration now reads its client credentials from a dedicated `kubernetes.auth.providers.microsoft.<env>` configuration block. These are backend-only secrets, so they live under `kubernetes.auth` instead of the frontend-visible `auth` section.

Depending on how your Entra Id enterprise application is set up, you can either reuse the same `tenantId`, `clientId`, and `clientSecret` as the Microsoft sign-in provider, or register a dedicated application for the Kubernetes backend if you want a clear separation between the user authentication flow and the Kubernetes backend authentication flow.

The environment used to resolve the per-environment block is taken from the new `kubernetes.auth.environment` config key, which defaults to `development`.

The resolved Microsoft Entra Id scope is now validated, so a malformed scope from either the cluster annotation or the config key fails with a descriptive error instead of an opaque token request failure.

**BREAKING**: Entra Id credentials for the Kubernetes backend must now be configured under `kubernetes.auth.providers.microsoft.<env>`. If you previously relied on the Microsoft auth provider credentials for Kubernetes, copy the `tenantId`, `clientId`, and `clientSecret` into `kubernetes.auth.providers.microsoft.<env>`.

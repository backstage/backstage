---
'@backstage/plugin-kubernetes-backend': minor
---

The Kubernetes Microsoft Entra Id integration now reads its client credentials from a dedicated `kubernetes.auth.microsoft.<env>` configuration block. This lets you use a separate Entra application for the Kubernetes backend, keeping it independent from the main Microsoft authentication provider.

When a credential field is not set under `kubernetes.auth.microsoft.<env>`, the backend falls back to the matching field under `auth.microsoft.<env>`, so adopters who do not want a dedicated application can simply reuse the shared values.

**BREAKING**: Credentials are no longer read from the Microsoft auth providers location. If you previously supplied Entra Id credentials for Kubernetes under the Microsoft auth providers block, move them to `kubernetes.auth.microsoft.<env>` or rely on the shared `auth.microsoft.<env>` values.

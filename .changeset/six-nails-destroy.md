---
'@backstage/plugin-vault-backend': minor
---

Support Kubernetes authentication for the Vault plugin. To do that, modify the current `vault.token` string
to an object like the following:

```yaml
vault:
  token:
    type: kubernetes
    role: <KUBERNETES_ROLE>
    authPath: <KUBERNETES_AUTH_PATH> # Optional. It defaults to 'kubernetes', but you could set a different authPath if needed
    serviceAccountTokenPath: <PATH_TO_JWT> # Optional. It defaults to '/var/run/secrets/kubernetes.io/serviceaccount/token'. Where the JWT token is located
```

To make sure the Kubernetes authentication is applied, and you're using the old
backend setup, you will need to call `await builder.loadToken()` on demand, to make sure
the token is fetched. And _always_ after the `builder.build()`.

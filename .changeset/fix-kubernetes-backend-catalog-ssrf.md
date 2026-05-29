---
'@backstage/plugin-kubernetes-backend': patch
---

**SECURITY**: Added an opt-in mitigation for a Server-Side Request Forgery
(SSRF) vulnerability in the catalog-based Kubernetes cluster locator
(`clusterLocatorMethods: [{ type: 'catalog' }]`).

The `kubernetes.io/api-server` annotation on a catalog `kubernetes-cluster`
Resource is the URL the backend sends credentials to when it talks to the
cluster. Because catalog entities can be created by any actor with catalog
write access, that URL is untrusted: an attacker can register a malicious
entity and exfiltrate the backend's cluster credentials (AWS STS bearer
tokens, Azure / GCP tokens, or a user's OIDC token).

The catalog cluster locator now accepts an explicit allowlist of trusted
cluster API server origins (scheme + host + optional port):

```yaml
kubernetes:
  clusterLocatorMethods:
    - type: catalog
      allowedClusterUrls:
        - https://my-cluster.example.com
        - https://eks-cluster.us-east-1.eks.amazonaws.com
```

When `allowedClusterUrls` is configured, catalog entities whose api-server
origin does not match an entry are filtered out (with a warning log).

For backwards compatibility, the locator still falls back to the previous
behaviour of trusting any URL supplied via catalog annotations when no
allowlist is configured, but it now logs a loud deprecation warning the
first time it does so. **A future release will switch this default to
deny-all**; configure `allowedClusterUrls` now to avoid the upcoming
breaking change. Adopters who consciously accept the risk in the meantime
can silence the warning with `allowUnsafeClusterUrls: true`.

---
'@backstage/plugin-kubernetes-backend': patch
---

The catalog cluster locator now validates Kubernetes API server URLs to block SSRF targets (non-public addresses, cloud metadata endpoints, and non-HTTPS URLs by default). Operators may list trusted hostnames in `dangerouslyAllowClusterUrls` on the catalog locator method to permit HTTP or non-public addresses for those hosts only (for example local minikube). Catalog entities cannot use the `serviceAccount` auth provider, cannot enable TLS verification skipping unless `dangerouslyAllowSkipTLSVerify` is set on the locator method, and only permitted annotations are passed through as auth metadata. Kubernetes API fetches no longer follow HTTP redirects automatically.

---
'@backstage/plugin-kubernetes-backend': patch
---

Added `endpointType` config option to the GKE cluster locator, allowing use of DNS-based control plane endpoints instead of public IP endpoints. Set `endpointType: 'dns'` to use GKE DNS endpoints (e.g. `gke-<uid>.<region>.gke.goog`) which provide proper TLS certificates and IAM-based access control.

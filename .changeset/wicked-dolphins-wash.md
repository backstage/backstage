---
'@backstage/plugin-kubernetes-backend': patch
---

On LocalKubectlProxyClusterLocator, when resolving localhost, IPv4 address is placed before IPv6 address, ignoring the order from the DNS resolver. This change is necessary since by default kubectl proxy listen on IPv4

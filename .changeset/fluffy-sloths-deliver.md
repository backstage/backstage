---
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-kubernetes-common': patch
---

Add support for 'oidc' as authProvider for kubernetes authentication
and adds optional 'oidcTokenProvider' config value. This will allow
users to authenticate to kubernetes cluster using id tokens obtained
from the configured auth provider in their backstage instance.

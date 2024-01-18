---
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': patch
---

Fixed a bug where refreshing would require a re-login due to invalid scopes being requested from the VMware Cloud Platform.

---
'@backstage/plugin-auth-backend-module-guest-provider': patch
---

Adds a new guest provider that maps guest users to actual tokens. This also shifts the default guest login to `user:development/guest` to reduce overlap with your production/real data. To change that (or set it back to the old default, use the new `auth.guestEntityRef` config key) like so,

```yaml title=app-config.yaml
auth:
  guestEntityRef: user:default/guest
```

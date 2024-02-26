---
'@backstage/plugin-auth-backend-module-guest-provider': minor
---

Adds a new guest provider that maps guest users to actual tokens. This also shifts the default guest login to `user:development/guest` to reduce overlap with your production/real data. To change that (or set it back to the old default, use the new `auth.providers.guest.userEntityRef` config key) like so,

```yaml title=app-config.yaml
auth:
  providers:
    guest:
      userEntityRef: user:default/guest
```

This also adds a new property to control the ownership entity refs,

```yaml title=app-config.yaml
auth:
  providers:
    guest:
      ownershipEntityRefs:
        - guests
        - development/custom
```

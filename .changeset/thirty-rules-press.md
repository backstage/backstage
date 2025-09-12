---
'@backstage/backend-defaults': minor
---

Add a new `externalTokenHandlersServiceRef` to allow custom external token validations

BREAKING CHANGE: The `backend.auth.keys` config has been removed. Please migrate to the new `backend.auth.externalAccess` config as described in the documentation: https://backstage.io/docs/auth/service-to-service-auth

**Migration Example:**

```yaml
# ❌ Old format (no longer supported)
backend:
  auth:
    keys:
      - secret: your-secret-key

# ✅ New format
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: your-secret-key
          subject: external:backstage-plugin # this is the current default for old keys
```

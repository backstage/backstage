---
'@backstage/plugin-auth-backend': minor
---

Bump `passport-saml` to version 3. This is a breaking change, in that it [now requires](https://github.com/node-saml/passport-saml/pull/548) the `auth.saml.cert` parameter to be set. If you are not using SAML auth, you can ignore this.

To update your settings, add something similar to the following to your app-config:

```yaml
auth:
  saml:
    # ... other settings ...
    cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqh ... W=='
```

For more information, see the [library README](https://github.com/node-saml/passport-saml#security-and-signatures).

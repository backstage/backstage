---
'@backstage/plugin-auth-backend': patch
---

Add a warning log message that `passport-saml` will require a `cert` config parameter imminently.

We intend to upgrade this package soon, past the point where we will start to strictly require the `auth.saml.cert` configuration parameter to be present. To avoid issues starting your auth backend, please

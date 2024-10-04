---
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': minor
---

**BREAKING**: The `profileEmailMatchingUserEntityEmail` sign-in resolver has been removed as it was using an insecure fallback for resolving user identities. See https://backstage.io/docs/auth/identity-resolver#sign-in-without-users-in-the-catalog for how to create a custom sign-in resolver if needed as a replacement.

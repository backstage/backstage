---
'@backstage/plugin-auth-node': patch
---

Fixed OAuth authorization requests incorrectly including previously granted scopes from the `<provider>-granted-scope` cookie, which could cause sign-in to fail when provider configuration changes or the identity provider no longer allows those scopes. New authorization requests now only include configured and explicitly requested scopes; persisted scopes are still used when refreshing tokens.

---
'@backstage/plugin-auth-node': patch
---

The `IdentityApi` interface (which is marked as unstable still) now has its
`getIdentity` method deprecated, and instead gained a `getUserIdentity` method
which is its intended replacement. The old method will be removed shortly.

The new method returns a new simpler type named `UserTokenIdentity` instead of
the old `BackstageIdentityResponse`. The reasoning behind this change is that
the latter was never meant to be used anywhere outside of the sign-in flow and
protocol. With the new method and `UserTokenIdentity`, the responsibility is
better clarified, and there will be better room for inventing a future
`ServerTokenIdentity` if need be.

This change intentionally stays away from trying to unify the handling of user
and server identities. For now, keep using the `TokenManager` for the latter
instead.

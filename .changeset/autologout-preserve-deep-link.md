---
'@backstage/core-app-api': patch
'@backstage/core-components': patch
---

Added support for the `preserveLocation` option in `IdentityApi.signOut`, allowing `AutoLogout` to preserve deep links upon disconnected session expiry. Note that when `preserveLocation` is enabled (including on idle auto-logout), the configured `signOutTargetUrl` is skipped, so apps pointing `signOutTargetUrl` at a proxy logout endpoint will no longer end the proxy session on idle auto-logout.

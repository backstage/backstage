---
'@backstage/plugin-auth-backend': patch
---

Fixes potential bug introduced in `0.4.10` which causes `OAuth2AuthProvider` to authenticate using credentials in both POST payload and headers.
This might break some stricter OAuth2 implementations so there is now a `includeBasicAuth` config option that can manually be set to `true` to enable this behavior.

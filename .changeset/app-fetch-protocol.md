---
'@backstage/plugin-app': patch
---

Added `createFetchApi`, `FetchMiddlewares`, and `FetchMiddleware` exports for constructing custom Fetch APIs in the new frontend system. The helper resolves `plugin://` URLs before custom middleware by default, with an explicit `resolvePluginProtocol: false` opt-out for implementations that already handle the protocol. The app's default Fetch API now uses this helper.

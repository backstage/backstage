---
'@backstage/plugin-auth-node': minor
---

Added possibility to customize OAuthCookieManager implementation. Interface was created basing on public methods of that class. Class itself was renamed to DefaultOAuthCookieManager, said interface was implemented in it and it was exported to ensure that the class can be extended further. While calling createOAuthProviderFactory function custom implementation can be injected by providing custom factory function.

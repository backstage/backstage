---
'@backstage/integration': patch
---

Added support for using a GitHub App installation to generate tokens for public repository access when the `publicAccess` option is enabled. When all other authentication methods fail (e.g., the app is not installed in that organization), the provider will now use an available installation to generate a token that can be used to access public repositories as read only.

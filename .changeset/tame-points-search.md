---
'@backstage/integration': patch
---

Add a `resolveUrl` method to integrations, that works like the two-argument URL
constructor. The reason for using this is that Azure have their paths in a
query parameter, rather than the pathname of the URL.

The implementation is optional (when not present, the URL constructor is used),
so this does not imply a breaking change.

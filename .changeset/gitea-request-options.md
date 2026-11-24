---
'@backstage/integration': patch
---

Fixed a bug in the Gitea integration where request options returned by `getGiteaRequestOptions` were missing the `headers` wrapper when no password was configured, so the returned object now has a consistent shape whether or not credentials are set.

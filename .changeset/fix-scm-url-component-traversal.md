---
'@backstage/integration': minor
---

SCM URLs whose repository, owner, or reference parts contain path traversal or URL query and fragment delimiter sequences are now rejected by the SCM URL helpers, and the Bitbucket Cloud and Server default branch lookups now apply the same validation.

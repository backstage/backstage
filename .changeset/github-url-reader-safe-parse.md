---
'@backstage/backend-defaults': patch
---

The GitHub and Bitbucket URL readers now reject URLs whose repository, owner, or reference parts contain path traversal or URL query and fragment delimiter sequences, including in their default branch and commit lookups.

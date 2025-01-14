---
'@backstage/backend-defaults': patch
---

The `GerritUrlReader` can now read content from a commit and not only from the top of a branch. The
Gitiles URL must contain the full commit `SHA` hash like: `https://gerrit.com/gitiles/repo/+/2846e8dc327ae2f60249983b1c3b96f42f205bae/catalog-info.yaml`.

---
'@backstage/backend-common': patch
---

`GerritUrlReader.readUrl()` will now use Gitiles to fetch files if available. This makes
it possible to fetch any file that is a valid Gitiles url and not just the tip of a branch.
Some examples of urls that can be read by `readUrl`:

- By sha: `.../repo/+/f6247461882814d8449b58a4bee5db76065da88f/README`
- By tag: `.../repo/+/refs/tags/v0.1.2/README`
- From an open review: `.../repo/+/refs/changes/11/11111/6/README`

If `gitilesBaseUrl` is not configured, `readUrl` will use the Gerrit api.

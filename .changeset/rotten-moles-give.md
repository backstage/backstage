---
'@backstage/integration': patch
---

Fixed bug in getGitLabFileFetchUrl where a target whose path did not contain the
`/-/` scope would result in a fetch URL that did not support
private-token-based authentication.

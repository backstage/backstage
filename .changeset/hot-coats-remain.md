---
'@backstage/cli': patch
---

Add support for bumping packages to versions specified by dist-tags in the
`versions:bump` command. This is primarily useful for bumping sets of
non-@backstage packages, which naturally don't appear in the version manifest.

---
'@backstage/cli-node': patch
'@backstage/cli': patch
---

Fixed an issue where default feature type information wasn't being added to package.json/exports before publishing if exports didn't exist beforehand

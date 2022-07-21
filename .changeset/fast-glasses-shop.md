---
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-techdocs-node': patch
---

Defer to implementation of techdocs preparer to delete the temporary directory. _Note_ previously, there was a comment mentioning that docs retrieved from github should be kept and docs retrieved otherwise should not. However the logic appeared to be incorrect. This change chooses to delete the files in any scenario.

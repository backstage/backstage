---
'@backstage/repo-tools': patch
---

Fix issues with warnings in API reports not being checked or reported.

Due to the recent version bump of API Extractor you may now see a lot of `ae-undocumented` warnings,
these can be ignored using the `-o` option, for example, `backstage-repo-tools api-reports -o ae-undocumented,ae-wrong-input-file-type`.

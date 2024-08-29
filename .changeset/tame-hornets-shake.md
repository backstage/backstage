---
'@backstage/plugin-scaffolder-react': patch
---

Fix an issue where keys with duplicate final key parts are not all displayed in the `ReviewState`. Change the way the keys are formatted to include the full schema path, separated by `>`.

---
'@backstage/plugin-scaffolder-backend': patch
---

The parameter schema endpoint now passes through the `when` field from parameter step entries, enabling conditional step visibility in the scaffolder wizard frontend. Backend validation for task creation and dry-run endpoints now skips parameter schema validation for steps whose `when` condition evaluates to false, and strips their values from the submitted parameters.

Updated Nunjitsu to 0.7.0. Parameter step conditions now use the same expression rules as the frontend wizard.

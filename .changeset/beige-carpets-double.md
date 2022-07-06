---
'@backstage/plugin-code-coverage': minor
---

Cleaned up API exports.

The `Router` export has been removed; users are expected to use `EntityCodeCoverageContent` instead.

The `isPluginApplicableToEntity` helper has been deprecated, in favor of the `isCodeCoverageAvailable` helper.

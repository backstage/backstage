---
'@backstage/plugin-catalog-node': minor
---

Breaking change to `/alpha` API where the `catalogAnalysisExtensionPoint` has been reworked. The `addLocationAnalyzer` method has been renamed to `addScmLocationAnalyzer`, and a new `setLocationAnalyzer` method has been added which allows the full `LocationAnalyzer` implementation to be overridden.

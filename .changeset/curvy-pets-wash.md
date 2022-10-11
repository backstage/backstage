---
'@backstage/plugin-catalog-backend': minor
---

Added a new method `addLocationAnalyzers` to the `CatalogBuilder`. With this you can add location analyzers to your catalog. These analyzers will be used by the /analyze-location endpoint to decide if the provided URL contains any catalog-info.yaml files already or not.

Moved the following types from this package to `@backstage/plugin-catalog-backend`.

- AnalyzeLocationResponse
- AnalyzeLocationRequest
- AnalyzeLocationExistingEntity
- AnalyzeLocationGenerateEntity
- AnalyzeLocationEntityField

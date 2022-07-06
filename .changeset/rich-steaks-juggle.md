---
'@backstage/plugin-tech-insights-node': patch
'@backstage/plugin-tech-insights-backend': minor
'@backstage/plugin-tech-insights-common': minor
---

**Breaking**: The FactRetriever model is extended by adding a title and description fields and moved to the common package. This allows us to
display Fact Retrievers in the UI in future.

If you have existing custom `FactRetriever` implementations hardcoded, you'll need to add a `title` and `description` to them.

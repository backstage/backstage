---
'@backstage/plugin-tech-insights-node': minor
'@backstage/plugin-tech-insights-backend': patch
---

**Breaking**: The FactRetriever model is extended by adding required title and description fields. This allows us to
display Fact Retrievers in the UI in future.

If you have existing custom `FactRetriever` implementations hardcoded, you'll need to add a `title` and `description` to them.

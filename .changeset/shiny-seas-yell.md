---
'@backstage/plugin-tech-insights-backend': minor
---

Updates tech-insights to use backend-tasks as the Fact Retriever scheduler.

_*BREAKING CHANGE*_ Due to integrations with tasks, which uses ID's that are compliant with Prometheus,
This also has the effect of switching FactRetrievers using underscores
instead of dashes. When upgrading, update your fact retrievers as so:

```diff
export const yourCustomFactRetriever: FactRetriever = {
  -id: 'your-custom-fact-retriever',
  +id: 'your_custom_fact_retriever',
  version: '0.0.1',
  schema: {
//...

```

---
'@backstage/plugin-tech-insights-backend': minor
---

**BREAKING**: Update FactRetrieverRegistry interface to be async so that db backed implementations can be passed through to the FactRetrieverEngine.

If you have existing custom `FactRetrieverRegistry` implementations, you'll need to remove the `retrievers` member and make all the methods async.

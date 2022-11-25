---
'@backstage/plugin-search-backend-node': patch
---

Use of `TestPipeline.withSubject()` is now deprecated. Instead, use the `fromCollator`, `fromDecorator`, or `fromIndexer` static methods to instantiate a test pipeline. You may also use the class' `withCollator`, `withDecorator`, and `withIndexer` instance methods to build test pipelines that consist of multiple test subjects.

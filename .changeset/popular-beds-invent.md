---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Index templates can now be configured through configuration under the `search.elasticsearch.indexTemplates`. In addition, the `ElasticSearchSearchEngine.fromConfig` now also accepts a `LoggerService` as the `logger` option as well as a new `translator` option.

The alpha `searchModuleElasticsearchEngine` export no longer accepts options and a new alpha `elasticsearchTranslatorExtensionPoint` export has been added which lets you customize the query translator.

---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Feature: add a new option to set the batch size for elastic search engine, if not given the default batch size is 1000

Example usage:

```yaml
search:
  elasticsearch:
    batchSize: 100
```

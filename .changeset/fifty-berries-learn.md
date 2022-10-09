---
'@backstage/plugin-catalog': minor
---

Added new column `Label` to `CatalogTable.columns`, this new column allows you make use of labels from metadata.
For example: category and visibility are type of labels associated with API entity illustrated below.

YAML code snippet for API entity

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: sample-api
  description: API for sample
  links:
    - url: http://localhost:8080/swagger-ui.html
      title: Swagger UI
  tags:
    - http
  labels:
    category: legacy
    visibility: protected
```

Consumers can customise columns to include label column and show in api-docs list

```typescript
const columns = [
  CatalogTable.columns.createNameColumn({ defaultKind: 'API' }),
  CatalogTable.columns.createLabelColumn('category', { title: 'Category' }),
  CatalogTable.columns.createLabelColumn('visibility', {
    title: 'Visibility',
    defaultValue: 'public',
  }),
];
```

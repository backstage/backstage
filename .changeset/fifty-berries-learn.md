---
'@backstage/plugin-catalog': patch
---

---

This change would allow consumers of plugin catalog to make use of labels just like tags from metadata.

The intent of change is to show customised columns based on selected label with which entity is associated.
For example: In example below category and visibility are type of labels associated with API entity.
YAML for API entity

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

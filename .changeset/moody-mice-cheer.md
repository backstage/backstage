---
'@backstage/plugin-catalog-backend': patch
---

Added an option to scan GitHub for repositories using a new location type `github-discovery`.
Example:

```yaml
type: 'github-discovery',
target:
   'https://github.com/backstage/techdocs-*/blob/master/catalog.yaml'
```

You can use wildcards (`*`) as well. This will add `location` entities for each matching repository.
Currently though, you must specify the exact path of the `catalog.yaml` file in the repository.

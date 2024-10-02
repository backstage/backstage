---
'@backstage/plugin-scaffolder-backend': patch
---

Add `fetch:template:file` scaffolder action to download a single file and template the contents. Example usage:

```yaml
- id: fetch-file
  name: Fetch File
  action: fetch:template:file
  input:
    url: https://github.com/backstage/software-templates/blob/main/scaffolder-templates/create-react-app/skeleton/catalog-info.yaml
    targetPath: './target/catalog-info.yaml'
    values:
      component_id: My Component
      owner: Test
```

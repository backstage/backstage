---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Enhancing GitLab provider with filtering projects by pattern RegExp

```yaml
providers:
  gitlab:
    stg:
      host: gitlab.stg.company.io
      branch: main
      projectPattern: 'john/' # new option
      entityFilename: template.yaml
```

With the aforementioned parameter you can filter projects, and keep only who belongs to the namespace "john".

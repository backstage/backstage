---
'@backstage/plugin-scaffolder-backend': minor
---

Removed support for deprecated publisher auth configuration within the `scaffolder` configuration block, such as `scaffolder.github.token`. Access should instead be configured through `integrations` configuration.

For example, replace the following configuration in `app-config.yaml`

```yaml
scaffolder:
  github:
    token: my-token
```

with

```yaml
integrations:
  github:
    - host: github.com
      token: my-token
```

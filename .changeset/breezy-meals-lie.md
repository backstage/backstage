---
'@backstage/backend-common': patch
'@backstage/plugin-scaffolder-backend': patch
---

Honor the branch ref in the url when cloning.

This fixes a bug in the scaffolder prepare stage where a non-default branch
was specified in the scaffolder URL but the default branch was cloned.
For example, even though the `other` branch is specified in this example, the
`master` branch was actually cloned:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
```

This also fixes a 404 in the prepare stage for GitLab URLs.

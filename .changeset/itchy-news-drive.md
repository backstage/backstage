---
'@backstage/plugin-azure-devops-backend': minor
'@backstage/plugin-azure-devops-common': minor
'@backstage/plugin-azure-devops': minor
---

Ability to fetch the README file from a different AZD path.

Defaults to the current, AZD default behaviour (`README.md` in the root of the git repo); to use a different path, add the annotation `dev.azure.com/readme-path`

Example:

```yaml
dev.azure.com/readme-path: /my-path/README.md
```

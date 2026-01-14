---
'@backstage/plugin-scaffolder-common': minor
'@backstage/plugin-scaffolder-backend': minor
---

Added support for defining a `secrets` schema in Software Templates. Template authors can now specify a JSON Schema in `spec.secrets` to validate secrets passed during task creation. This enables templates to declare required secrets and have them validated by the API before task execution.

Example usage:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: publish-to-npm
spec:
  type: service
  secrets:
    type: object
    required:
      - NPM_TOKEN
    properties:
      NPM_TOKEN:
        type: string
        description: NPM publish token
  steps:
    - id: publish
      action: npm:publish
      input:
        token: ${{ secrets.NPM_TOKEN }}
```

When required secrets are missing, the API returns a 400 error with a descriptive message like `secrets.NPM_TOKEN is required`.

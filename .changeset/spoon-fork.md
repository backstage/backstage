---
'@backstage/create-app': patch
---

Add `*-credentials.yaml` to gitignore to prevent accidental commits of sensitive credential information.

To apply this change to an existing installation, add these lines to your `.gitignore`

```gitignore
# Sensitive credentials
*-credentials.yaml
```

---
'@backstage/create-app': patch
---

Add `*-credentials.yaml` to gitignore to prevent accidental commits of sensitive credential information.

To apply this change to an existing installation, add this line to your `.gitignore`

```gitignore
*-credentials.yaml
```

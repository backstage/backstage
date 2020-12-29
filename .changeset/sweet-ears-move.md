---
'@backstage/create-app': patch
---

Added `"start-backend"` script to root `package.json`.

To apply this change to an existing app, add the following script to the root `package.json`:

```json
"start-backend": "yarn workspace backend start"
```

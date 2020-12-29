---
'@backstage/create-app': patch
---

Add missing `yarn clean` for app.

For users with existing Backstage installations, add the following under the `scripts` section in `packages/app/package.json`, after the "lint" entry:

```json
"clean": "backstage-cli clean",
```

This will add the missing `yarn clean` for the generated frontend.

---
'@backstage/create-app': patch
---

Optimized the `yarn install` step in the backend `Dockerfile`.

To apply these changes to an existing app, make the following changes to `packages/backend/Dockerfile`:

Replace the `RUN yarn install ...` line with the following:

```bash
RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
```

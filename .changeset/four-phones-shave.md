---
'@backstage/plugin-auth-backend': minor
---

Avoid ever returning OAuth refresh tokens back to the client, and always exchange refresh tokens for a new one when available for all providers.

This comes with a breaking change to the TypeScript API for custom auth providers. The `refresh` method of `OAuthHandlers` implementation must now return a `{ response, refreshToken }` object rather than a direct response. Existing `refresh` implementations are typically migrated by changing an existing return expression that looks like this:

```ts
return await this.handleResult({
  fullProfile,
  params,
  accessToken,
  refreshToken,
});
```

Into the following:

```ts
return {
  response: await this.handleResult({
    fullProfile,
    params,
    accessToken,
  }),
  refreshToken,
};
```

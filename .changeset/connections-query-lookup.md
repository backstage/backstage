---
'@backstage/connections': minor
---

**BREAKING**: Connection lookups now take a `query` object instead of a `url`. Every connection type declares which query it accepts, so types that are not identified by a URL can be looked up by other identifiers. All built-in connection types are still matched by URL, so existing lookups just move the URL into the query:

```ts
const connection = await connections.find({
  type: 'github',
  query: { url },
  authMethods: ['app', 'token'],
});
```

Connections returned from a lookup now also include their `type`.

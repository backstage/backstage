---
'@backstage/backend-common': minor
---

Encode thrown errors in the backend as a JSON payload. This is technically a breaking change, since the response format even of errors are part of the contract. If you relied on the response being text, you will now have some extra JSON "noise" in it. It should still be readable by end users though.

Before:

```
NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'
    at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)
```

After:

```json
{
  "error": {
    "statusCode": 404,
    "name": "NotFoundError",
    "message": "No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'",
    "stack": "NotFoundError: No entity named 'tara.macgovern2' found, with kind 'user' in namespace 'default'\n    at eval (webpack-internal:///../../plugins/catalog-backend/src/service/router.ts:117:17)"
  },
  "request": {
    "method": "GET",
    "url": "/entities/by-name/user/default/tara.macgovern2"
  }
}
```

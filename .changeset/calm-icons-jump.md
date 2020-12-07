---
'@backstage/core-api': patch
'@backstage/dev-utils': patch
---

Update ApiFactory type to correctly infer API type and disallow mismatched implementations.

This fixes for example the following code:

```ts
interface MyApi {
  myMethod(): void
}

const myApiRef = createApiRef<MyApi>({...});

createApiFactory({
  api: myApiRef,
  deps: {},
  // This should've caused an error, since the empty object does not fully implement MyApi
  factory: () => ({}),
})
```

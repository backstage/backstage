---
'@backstage/create-app': patch
---

Highlight processingInterval as an important setting of the catalog see here
https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/config.d.ts#L170
This is especially more important as the current fallback value is within

```
return createRandomProcessingInterval({
  minSeconds: 100,
  maxSeconds: 150,
});
```

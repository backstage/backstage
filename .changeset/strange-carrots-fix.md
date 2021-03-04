---
'@backstage/create-app': patch
---

Updated the default `App` test to work better on Windows.

To apply this change to an existing app, replace the `process.env.APP_CONFIG` definition in `packages/app/src/App.test.tsx` with the following:

```ts
process.env = {
  NODE_ENV: 'test',
  APP_CONFIG: [
    {
      data: {
        app: { title: 'Test' },
        backend: { baseUrl: 'http://localhost:7000' },
        techdocs: {
          storageUrl: 'http://localhost:7000/api/techdocs/static/docs',
        },
      },
      context: 'test',
    },
  ] as any,
};
```

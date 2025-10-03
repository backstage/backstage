---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-permission-react': patch
'@backstage/plugin-app': patch
---

Add optional props to the overridable error page component. Error pages now send correct status code and status message i.e. not found gives 404 and failed permission results in a 403 forbidden. When creating a custom error page you may now use additional props.

```ts
const app = createApp({
  ...
  components: {
    NotFoundErrorPage: ({ status, statusMessage }) => (
      <>
        <div>This is my status: {status}</div>
        <div>This is my status message: {statusMessage}</div>
      </>
    )
  },
});
```

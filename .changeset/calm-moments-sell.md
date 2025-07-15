---
'@backstage/frontend-plugin-api': minor
'@backstage/core-plugin-api': minor
'@backstage/plugin-permission-react': minor
'@backstage/plugin-app': minor
'@backstage/app-defaults': minor
'@backstage/core-app-api': minor
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-techdocs': minor
---

Add optional props to the overridable error page component. TechDocs not found page now uses the overridable not found error page. Error pages now send correct status code and status message i.e. not found gives 404 and failed permission results in a 403 forbidden. When creating a custom error page you may now use additional props.

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

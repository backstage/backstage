---
'@backstage/core-components': patch
---

Added option to pass additional headers to `<ProxiedSignInPage />`

The <ProxiedSignInPage /> supports signing into Backstage with a Sign Page coming from an external provider e.g. Google IAP, AWS ALB, etc. The component makes requests to a single endpoint `/refresh` on the auth backend to fetch the logged in user session.

If the provider in auth backend expects additional headers such as `x-provider-token`, there is now a way to configure that in `ProxiedSignInPage` using the optional `getHeaders` prop.

Example -

```tsx
const app = createApp({
  // ...
  components: {
    SignInPage: props => (
      <ProxiedSignInPage
        {...props}
        provider="my-custom-provider"
        getHeaders={async () => {
          const someValue = await someFn();
          return { 'x-some-key': someValue };
        }}
      />
    ),
  },
  // ...
});
```

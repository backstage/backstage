---
'@backstage/core-components': patch
---

Added an option to allow the `AlertMessage` to be self-closing. This is done with a new `display` property that is set to `transient` on the `AlertMessage` when triggering a message to the `AlertApi`. The length of time that these transient messages stay open for can be set using the `transientTimeoutMs` prop on the `AlertDisplay` in the `App.tsx`. Here is an example:

```diff
  const App = () => (
    <AppProvider>
+     <AlertDisplay transientTimeoutMs={2500} />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </AppProvider>
  );
```

The above example will set the transient timeout to 2500ms from the default of 5000ms

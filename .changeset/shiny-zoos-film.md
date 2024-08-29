---
'@backstage/plugin-signals': patch
---

Added a `SignalsDisplay` extension to allows the signals plugin to be installed in an app as follows:

```tsx
export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

With this in place you can remove the explicit installation via the `plugins` option for `createApp`.

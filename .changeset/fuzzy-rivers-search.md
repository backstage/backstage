---
'@backstage/core-app-api': minor
---

Added a new `AppRouter` component and `app.createRoot()` method that replaces `app.getRouter()` and `app.getProvider()`, which are now deprecated. The new `AppRouter` component is a drop-in replacement for the old router component, while the new `app.createRoot()` method is used instead of the old provider component.

An old app setup might look like this:

```tsx
const app = createApp(/* ... */);

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = ...;

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
```

With these new APIs, the setup now looks like this:

```tsx
import { AppRouter } from '@backstage/core-app-api';

const app = createApp(/* ... */);

const routes = ...;

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

Note that `app.createRoot()` accepts a React element, rather than a component.

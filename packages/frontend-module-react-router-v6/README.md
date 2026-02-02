# @backstage/frontend-module-react-router-v6

This package provides a React Router 6 implementation of the `RouterApi` for the Backstage frontend system.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/frontend-module-react-router-v6
```

## Usage

This module is typically used by the app plugin (`@backstage/plugin-app`) to provide the default router implementation. The `ReactRouter6RouterApi` is automatically registered as the default `RouterApi` implementation.

### Using Routing Hooks and Components

Import hooks and components directly from `@backstage/frontend-plugin-api`:

```tsx
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from '@backstage/frontend-plugin-api';

function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details/:id" element={<Details />} />
    </Routes>
  );
}
```

## Custom Router Implementations

If you want to use a different router (e.g., TanStack Router or React Router v7), you can create your own implementation of `RouterApi` and override the default using an `ApiBlueprint`.

### Step 1: Create Your Router Implementation

```tsx
// In your app or a custom package
import type { RouterApi } from '@backstage/frontend-plugin-api';

export class MyCustomRouterApi implements RouterApi {
  // Implement all required methods and components
  Router = ({ children }) => (
    <YourRouterProvider>{children}</YourRouterProvider>
  );

  useLocation() {
    // Your implementation
  }

  useNavigate() {
    // Your implementation
  }

  // ... implement other required methods
}
```

### Step 2: Override the Default API

In your app's configuration, create an `ApiBlueprint` that provides your custom implementation:

```tsx
// packages/app/src/apis.ts
import { ApiBlueprint, routerApiRef } from '@backstage/frontend-plugin-api';
import { MyCustomRouterApi } from './MyCustomRouterApi';

export const customRouterApi = ApiBlueprint.make({
  name: 'router',
  params: defineParams =>
    defineParams({
      api: routerApiRef,
      deps: {},
      factory: () => new MyCustomRouterApi(),
    }),
});
```

### Step 3: Register the API in Your App

```tsx
// packages/app/src/App.tsx
import { createApp } from '@backstage/frontend-defaults';
import { customRouterApi } from './apis';

const app = createApp({
  features: [
    customRouterApi,
    // ... other features
  ],
});

export default app.createRoot();
```

## Links

- [Backstage documentation](https://backstage.io/docs)

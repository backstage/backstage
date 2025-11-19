---
id: router-api
title: Router API
sidebar_label: Router API
description: Understanding and customizing the Router API for navigation
---

The Router API (`routerApiRef`) is a core utility API that abstracts routing operations in Backstage. It provides a consistent interface for navigation, route matching, and link components, allowing the underlying router implementation to be swapped without affecting plugin code.

## Overview

The Router API decouples Backstage plugins from direct dependencies on routing libraries like `react-router-dom`. Instead of importing routing primitives directly from a router library, plugins import them from `@backstage/frontend-plugin-api`:

```tsx
import {
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useResolvedPath,
  useHref,
} from '@backstage/frontend-plugin-api';
```

## Default Implementation

By default, Backstage uses React Router 6 via the `ReactRouter6RouterApi` from `@backstage/frontend-module-react-router-v6`. This is automatically configured by the app plugin (`@backstage/plugin-app`).

## Using Routing in Plugins

### Navigation Components

Use `Link` and `NavLink` for navigation:

```tsx
import { Link, NavLink } from '@backstage/frontend-plugin-api';

function Navigation() {
  return (
    <nav>
      <Link to="/home">Home</Link>
      <NavLink
        to="/catalog"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
        })}
      >
        Catalog
      </NavLink>
    </nav>
  );
}
```

### Defining Routes

Use `Routes` and `Route` to define route hierarchies:

```tsx
import { Routes, Route, Outlet } from '@backstage/frontend-plugin-api';

function MyPluginPage() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/settings" element={<SettingsLayout />}>
        <Route path="general" element={<GeneralSettings />} />
        <Route path="advanced" element={<AdvancedSettings />} />
      </Route>
    </Routes>
  );
}

function SettingsLayout() {
  return (
    <div>
      <h1>Settings</h1>
      <Outlet /> {/* Renders child routes */}
    </div>
  );
}
```

### Routing Hooks

Access routing state and navigation programmatically:

```tsx
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from '@backstage/frontend-plugin-api';

function MyComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    navigate('/new-path', { state: { from: location.pathname } });
  };

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <p>Item ID: {id}</p>
      <button onClick={handleClick}>Navigate</button>
    </div>
  );
}
```

## Customizing the Router Implementation

You can replace the default router implementation with your own by creating an `ApiBlueprint` that provides a custom `RouterApi` implementation.

### Step 1: Create Your Router Implementation

Implement the `RouterApi` interface:

```tsx
import type {
  RouterApi,
  RouteObject,
  RouteMatch,
  Location,
  Path,
  To,
} from '@backstage/frontend-plugin-api';
import { ComponentType, ReactElement, ReactNode } from 'react';

export class MyCustomRouterApi implements RouterApi {
  // Router wrapper component
  Router: ComponentType<{ children: ReactNode; basePath: string }> = ({
    children,
    basePath,
  }) => {
    return (
      <YourRouterProvider basePath={basePath}>{children}</YourRouterProvider>
    );
  };

  // Static functions
  matchRoutes<T extends RouteObject>(
    routes: T[],
    location: { pathname: string },
  ): RouteMatch<T>[] | null {
    // Your implementation
  }

  generatePath(
    path: string,
    params?: Record<string, string | undefined>,
  ): string {
    // Your implementation
  }

  // Hooks
  useLocation(): Location {
    // Your implementation - must be called within Router
  }

  useParams<T extends Record<string, string | undefined>>(): T {
    // Your implementation
  }

  useNavigate(): NavigateFunction {
    // Your implementation
  }

  useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
    // Your implementation
  }

  useResolvedPath(to: To): Path {
    // Your implementation
  }

  useHref(to: To): string {
    // Your implementation
  }

  useRoutes(
    routes: RouteObject[],
    location?: Partial<Location> | string,
  ): ReactElement | null {
    // Your implementation
  }

  // Components
  Link: ComponentType<LinkProps> = YourLinkComponent;
  NavLink: ComponentType<NavLinkProps> = YourNavLinkComponent;
  Outlet: ComponentType<OutletProps> = YourOutletComponent;
}
```

### Step 2: Create an API Override

Create a frontend module that provides your custom implementation:

```tsx
import {
  createFrontendModule,
  ApiBlueprint,
  routerApiRef,
} from '@backstage/frontend-plugin-api';
import { MyCustomRouterApi } from './MyCustomRouterApi';

const customRouterModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    ApiBlueprint.make({
      name: 'router',
      params: {
        factory: createApiFactory({
          api: routerApiRef,
          deps: {},
          factory: () => new MyCustomRouterApi(),
        }),
      },
    }),
  ],
});

export { customRouterModule };
```

### Step 3: Register in Your App

Add the module to your app's features:

```tsx
import { createApp } from '@backstage/frontend-defaults';
import { customRouterModule } from './customRouterModule';

const app = createApp({
  features: [
    customRouterModule,
    // ... other features
  ],
});

export default app.createRoot();
```

## Testing

For testing components that use routing, `@backstage/frontend-test-utils` provides a `MockRouterApi` that uses a `MemoryRouter` internally:

```tsx
import { MockRouterApi } from '@backstage/frontend-test-utils';
import { renderInTestApp } from '@backstage/frontend-test-utils';

describe('MyComponent', () => {
  it('renders with routing', async () => {
    const { getByText } = await renderInTestApp(<MyComponent />, {
      routerOptions: {
        initialEntries: ['/my-path'],
      },
    });

    expect(getByText('My Path Content')).toBeInTheDocument();
  });
});
```

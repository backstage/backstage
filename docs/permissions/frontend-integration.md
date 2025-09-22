---
id: frontend-integration
title: Frontend Integration
description: How to place your Backstage frontend components behind authorization
---

:::info
Starting with a [fresh Backstage installation](https://backstage.io/docs/getting-started/), the code example below is already implemented, so there are no actual code changes required.
:::

Now that we understand how to [author a permission policy](./writing-a-policy.md), let's consider cases where we'll need to supplement our policy with authorization checks on the frontend.

In most cases, actual functionality that live within various plugins will already have been placed behind authorization by the plugin authors. The permission backend will use your permission policy to return an authorization result, and the plugin frontend will correspondingly show/hide/disable the relevant UI component.

However, there are some cases where the integrator needs to supplement the policy on the frontend. One example is app level routing.

If your Backstage permission policy may return a `DENY` for users requesting the `catalogEntityCreatePermission`, it may make sense, for example, to remove access to the `/catalog-import` page entirely:

```tsx title="packages/app/src/App.tsx"
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

const routes = (
  <FlatRoutes>
    <Route
      path="/catalog-import"
      element={
        {/* highlight-next-line */}
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    {/* ... */}
  </FlatRoutes>
);
```

With this change, users who are denied the `catalogEntityCreatePermission` should now be unable to access the `/catalog-import` page.

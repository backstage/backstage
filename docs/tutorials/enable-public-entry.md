---
id: enable-public-entry
title: Enabling public entry point
description: A guide for how to experiment with public and protected Backstage app bundles
---

# Enable Public Entry (Experimental)

In this tutorial, you will learn how to restrict access to your main Backstage app bundle to authenticated users only.

It is expected that the protected bundle feature will be refined in future development iterations, but for now, here is a simplified explanation of how it works:

Your Backstage app bundle is split into two code entries:

- Public entry point containing login pages;
- There is also a protected main entry point that contains the code for what you see after signing in.

With that, Backstage's cli and backend will detect public entry point and serve it to unauthenticated users, while serving the main, protected entry point only to authenticated users.

## Requirements

- The tutorial will only work for those using backstage-cli to build and serve their Backstage app.

## Trying out this feature

1. Add a `index-public-experimental.tsx` to your app `src` folder;

2. Prepare an unauthenticated version of your application. This will be the public entry point for your site:

   ```tsx title="in packages/app/src/index-public-experimental.tsx"
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { createApp } from '@backstage/app-defaults';
   import { AppRouter } from '@backstage/core-app-api';
   import {
     AlertDisplay,
     OAuthRequestDialog,
     SignInPage,
   } from '@backstage/core-components';
   import {
     configApiRef,
     createApiFactory,
     discoveryApiRef,
   } from '@backstage/core-plugin-api';
   import { RedirectToRoot } from '@backstage/plugin-auth-react';
   import { providers } from '../src/identityProviders';
   import { AuthProxyDiscoveryApi } from '../src/AuthProxyDiscoveryApi';

   // Notice that this is only setting up what is needed by the sign-in pages
   const app = createApp({
     apis: [
       createApiFactory({
         api: discoveryApiRef,
         deps: { configApi: configApiRef },
         factory: ({ configApi }) =>
           AuthProxyDiscoveryApi.fromConfig(configApi),
       }),
     ],
     components: {
       SignInPage: props => {
         return (
           <SignInPage
             {...props}
             providers={['guest', 'custom', ...providers]}
             title="Select a sign-in method"
             align="center"
           />
         );
       },
     },
   });

   const App = app.createRoot(
     <>
       <AlertDisplay transientTimeoutMs={2500} />
       <OAuthRequestDialog />
       <AppRouter>
         {/* This is a special component that does the magic to redirect users to access the home page of your authenticated application version */}
         <RedirectToRoot />
       </AppRouter>
     </>,
   );

   ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
   ```

3) Then ensure your main entry is also protected by the experimental app provider, as shown in the following example:

```tsx title="in packages/app/src/index-public-experimental.tsx"
// ...
export default app.createRoot(
  <>
    <AlertDisplay transientTimeoutMs={2500} />
    <OAuthRequestDialog />
    <AppRouter>
      {/* For now, this is just a temporary solution to ensure the user remains logged in properly and has access to the main app content. */}
      <ExperimentalAppProtection>
        <VisitListener />
        <Root>{routes}</Root>
      </ExperimentalAppProtection>
    </AppRouter>
  </>,
);
```

4. You're now ready to build your front-end app:

```sh
yarn workspace example-app build
```

5. And also serve it from your Backstage app backend:

```sh
yarn start-backend:next
```

6. Finally, access http://localhost:7007 to see the public app being served (note that only a minimal app is being served). Log in and you will be redirected to the main app home page (check the protected bundle being served from the app-backend after the redirect).

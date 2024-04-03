---
id: enable-public-entry
title: Enabling a public entry point
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

## Step-by-step

1. Create a `index-public-experimental.tsx` in your app `src` folder;
   :::note
   The filename is a convention, so it is not currently configurable.
   :::

2. This file is the public entry point for your application, and it should only contain what unauthenticated users should see:

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
   import { CookieAuthRootRedirect } from '@backstage/plugin-auth-react';
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
         <CookieAuthRootRedirect />
       </AppRouter>
     </>,
   );

   ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
   ```

3. The frontend will handle cookie refreshing automatically, so you don't have to worry about it;

4. You're now ready to build and serve your frontend and backend as usual;

5. After that, access your backend index endpoint to see the public app being served (note that only a minimal app is being served).

6. Log in and you will be redirected to the main app home page (check the protected bundle being served from the app-backend after the redirect).

That's it!

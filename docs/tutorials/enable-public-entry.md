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

- The app needs to be served by the `app-backend` plugin, or this won't work;
- Also it will only work for those using `backstage-cli` to build and serve their Backstage app.

## Step-by-step

1. Create a `index-public-experimental.tsx` in your app `src` folder.
   :::note
   The filename is a convention, so it is not currently configurable.
   :::

2. This file is the public entry point for your application, and it should only contain what unauthenticated users should see:

   ```tsx title="in packages/app/src/index-public-experimental.tsx"
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
     discoveryApiRef,
     createApiFactory,
   } from '@backstage/core-plugin-api';
   import { CookieAuthRedirect } from '@backstage/plugin-auth-react';

   // Notice that this is only setting up what is needed by the sign-in pages
   const app = createApp({
     // If you have any custom APIs that your sign-in page depends on, you need to add them here
     apis: [],
     components: {
       SignInPage: props => {
         return (
           <SignInPage
             {...props}
             providers={['guest']}
             title="Select a sign-in method"
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
         {/* This component triggers an authenticated redirect to the main app, while staying on the same URL */}
         <CookieAuthRedirect />
       </AppRouter>
     </>,
   );

   ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
   ```

   :::note
   The frontend will handle cookie refreshing automatically, so you don't have to worry about it.
   :::

3. Let's verify that everything is working locally. From your project root folder, run the following commands to build the app and start the backend:

   ```sh
   # building the app package
   yarn workspace app start
   # starting the backend api
   yarn start-backend
   ```

4. Visit http://localhost:7007 to see the public app and validate that the _index.html_ response only contains a minimal application.
   :::note
   Regular app serving will always serve protected apps without authenticating.
   :::

5. Finally, as soon as you log in, you will be redirected to the main app home page (inspect the page and see that the protected bundle was served from the app backend after the redirect).

That's it!

## New Frontend System

If your app uses the new frontend system, you can still use the public entry point feature. The `index-public-experimental.tsx` file does end up looking a bit different in this case:

```tsx title="in packages/app/src/index-public-experimental.tsx"
import ReactDOM from 'react-dom/client';
import { signInPageModule } from './overrides/SignInPage';
import { createPublicSignInApp } from '@backstage/frontend-defaults';

const app = createPublicSignInApp({
  features: [signInPageModule],
});

ReactDOM.createRoot(document.getElementById('root')!).render(app.createRoot());
```

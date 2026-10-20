---
id: enable-public-entry
title: Enabling a public entry point
description: A guide for how to experiment with public and protected Backstage app bundles
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./enable-public-entry--old.md)
instead.
::::

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
   import { signInPageModule } from './overrides/SignInPage';
   import { appModulePublicSignIn } from '@backstage/plugin-app/alpha';
   import { createApp } from '@backstage/frontend-defaults';

   const app = createApp({
     features: [signInPageModule, appModulePublicSignIn],
   });

   ReactDOM.createRoot(document.getElementById('root')!).render(
     app.createRoot(),
   );
   ```

   The `signInPageModule` is your custom sign-in page extension that you should already have configured in your app. The `appModulePublicSignIn` from `@backstage/plugin-app/alpha` provides the `CookieAuthRedirect` component that triggers an authenticated redirect to the main app after sign-in. Repeated redirect handoffs for the same user are safe and continue to the main app when the user is already authenticated.

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

4. Visit <http://localhost:7007> to see the public app and validate that the _index.html_ response only contains a minimal application.
   :::note
   Regular app serving will always serve protected apps without authenticating.
   :::

5. Finally, as soon as you log in, you will be redirected to the main app home page (inspect the page and see that the protected bundle was served from the app backend after the redirect).

That's it!

## Restricting public configuration

When serving a protected app with a public entry point, the app backend injects
all frontend-visible configuration into both entry points by default. To restrict
what is initially exposed to users without an authenticated session cookie,
configure `app.publicConfig`:

```yaml
app:
  publicConfig:
    allowedConfig:
      - app.title
      - backend.baseUrl
      - auth.environment
      - auth.providers
    allowedExtensions:
      - sign-in-page:app
```

The presence of `app.publicConfig` enables filtering. Missing or empty lists allow
no config keys or extensions. An existing extension list is replaced with an empty
list when no extension IDs are allowed.
Allowed key paths include their descendants, except that `app.extensions` is
always controlled exclusively by `allowedExtensions`, including when `app` or
`app.extensions` is listed in `allowedConfig`. Extension IDs are matched exactly
for both string entries and object entries. These IDs select extension configuration
to expose; they do not control which extensions the public app loads. Normal
frontend visibility rules still apply. Authenticated users continue to receive the
full frontend-visible configuration.

Filtering applies to the injected configuration payload. HTML templates still
receive the full frontend-visible config, so titles and asset paths work even
when their config keys are omitted from `allowedConfig`. Values explicitly
rendered by a template remain visible in the HTML regardless of these allowlists.

Do not combine `app.publicConfig` with `app.disableConfigInjection: true`.
Filtering requires runtime configuration injection; disabling injection serves
the configuration embedded at build time without applying these allowlists.

This setting only applies when serving the enabled public entry point to
unauthenticated users. It has no effect when that entry point is absent or
disabled. The main entry point always receives the full frontend-visible config.

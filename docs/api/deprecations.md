---
id: deprecations
title: Deprecations
description: A list of active and past deprecations
---

## Introduction

This page contains extended documentation for some of the deprecations in
various parts of Backstage. It is not an exhaustive list as most deprecation
only come in the form of a changelog notice and a console warning. The
deprecations listed here are the ones that need a bit more guidance than what
fits in a console message.

### App Theme

`Released 2021-11-12 in @backstage/core-plugin-api v0.1.13`

In order to provide more flexibility in what types of themes can be used and how
they are applied, the `theme` property on the `AppTheme` type is being
deprecated and replaced by a `Provider` property instead. The `Provider`
property is a React component that will be mounted at the root of the app
whenever that theme is active. This also removes the tight connection to MUI and
opens up for other type of themes, and removes the hardcoded usage of
`<CssBaseline>`.

To migrate an existing theme, remove the `theme` property and move it over to a
new `Provider` component, using `ThemeProvider` from MUI to provide the new
theme, along with `<CssBaseline>`. For example a theme that currently looks like
this:

```tsx
const darkTheme = {
  id: 'dark',
  title: 'Dark Theme',
  variant: 'dark',
  icon: <DarkIcon />,
  theme: darkTheme,
};
```

Would be migrated to the following:

```tsx
const darkTheme = {
  id: 'dark',
  title: 'Dark Theme',
  variant: 'dark',
  icon: <DarkIcon />,
  Provider: ({ children }) => (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  ),
};
```

Note that the existing `AppTheme` type still requires the `theme` property to be
set since it's the type that's consumed in the `AppThemeApi`, and it would be a
breaking change to make `theme` optional. This means that if you currently
construct the themes that you pass on to `createApp` using `AppTheme` as an
intermediate type, you will need to work around this in some way, for example by
passing the themes to `createApp` more directly.

### Generic Auth API Refs

`Released 2021-12-16 in @backstage/core-plugin-api v0.3.1`

There are four auth Utility API references in `@backstage/core-plugin-api` that
were too generic to be useful. The APIs in question are `auth0AuthApiRef`,
`oauth2ApiRef`, `oidcAuthApiRef`, and `samlAuthApiRef`. The issue with these
APIs was that they had no actual contract of what the backing auth provider was.
This made it more or less impossible to use these providers in open source
plugins in any meaningful way. We also did not want to keep these Utility API
references around just as helpers either, instead opting to remove them and let
integrators define their own APIs that are more specific to their auth provider.
This is also falls in line with a long-term goal to unify all auth providers to
not have separate frontend implementations.

If you're currently using one of these API references for either Sign-In or
access delegation within an app, there are a couple of steps you need to take to
migrate to your own custom API.

First, you'll need to define a new Utility API reference. If you're only using
the API for sign-in, you can put the definition in `packages/app/src/apis.ts`.
However, if you need to access your auth API inside plugins you you'll need to
export it from a common package. If you don't already have one we recommended
creating `@internal/apis` and from there export the API reference.

```ts
// `ProfileInfoApi & BackstageIdentityApi & SessionApi` are required for sign-in
// Include `OAuthApi & OpenIdConnectApi` only if applicable
export const acmeAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'internal.auth.acme',
});
```

Next you'll want to wire up the API inside `packages/app/src/apis.ts`, which
varies depending on which API you're replacing. If you for example are replacing
the `oauth2ApiRef`, the factory might look like this:

```ts
// oauth2
createApiFactory({
  api: acmeAuthApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    oauthRequestApi: oauthRequestApiRef,
    configApi: configApiRef,
  },
  factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
    OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString('auth.environment'),
    }),
});
```

Provider specific factory implementations, copy the code you need into the
factory method depending on which apiRef you previously used.

```ts
// samlAuthApiRef
SamlAuth.create({
  discoveryApi,
  environment: configApi.getOptionalString('auth.environment'),
});

// oidcAuthApiRef
OAuth2.create({
  discoveryApi,
  oauthRequestApi,
  provider: {
    id: 'oidc',
    title: 'Your Identity Provider',
    icon: () => null,
  },
  environment: configApi.getOptionalString('auth.environment'),
});

// auth0AuthApiRef
OAuth2.create({
  discoveryApi,
  oauthRequestApi,
  provider: {
    id: 'auth0',
    title: 'Auth0',
    icon: () => null,
  },
  defaultScopes: ['openid', 'email', 'profile'],
  environment: configApi.getOptionalString('auth.environment'),
});
```

Finally, for the provider to show up in your settings menu, you also need to
update the settings route in `packages/app/src/App.tsx` to pass the
`acmeAuthApiRef` to the `UserSettingsPage`. This replaces all existing provider
items, so you might want to add back any of the default ones that you are using
from the
[DefaultProviderSettings](https://github.com/backstage/backstage/blob/a3ec122170e0205fd3f9c307b98b1c5e4f55bf5f/plugins/user-settings/src/components/AuthProviders/DefaultProviderSettings.tsx#L35).

```tsx
<Route
  path="/settings"
  element={
    <UserSettingsPage
      providerSettings={
        <ProviderSettingsItem
          title="ACME"
          description="Provides sign-in via ACME"
          apiRef={acmeAuthApiRef}
          icon={Star}
        />
      }
    />
  }
/>
```

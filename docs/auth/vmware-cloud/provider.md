---
id: provider
title: VMware Cloud Authentication Provider
sidebar_label: VMware Cloud
description: Adding VMware Cloud as an authentication provider in Backstage
---

Backstage comes with an auth provider module to allow users to sign-in with
their VMware Cloud account. This page describes some actions within the VMware
Cloud Console and within a Backstage app required to enable this capability.

## Create an OAuth App in the VMware Cloud Console

1. Log in to the [VMware Cloud Console](https://console.cloud.vmware.com).
1. Navigate to [Identity & Access Management > OAuth
   Apps](https://console.cloud.vmware.com/csp/gateway/portal/#/consumer/usermgmt/oauth-apps)
   and click the [Owned
   Apps](https://console.cloud.vmware.com/csp/gateway/portal/#/consumer/usermgmt/oauth-apps/owned-apps/view)
   tab -- if you are not an Organization Owner or Administrator but only a
   Member, you will not see this nav entry unless the **Developer** check box is
   selected for your role (see the [Organization roles and
   permissions](https://docs.vmware.com/en/VMware-Cloud-services/services/Using-VMware-Cloud-Services/GUID-C11D3AAC-267C-4F16-A0E3-3EDF286EBE53.html#organization-roles-and-permissions-0)
   docs for details).
1. Click **Create App**, choose 'Web/Mobile app' and click **Continue**.
1. Use default settings except:
   - `App Name` and `App Description` of your choosing.
   - `Redirect URIs`: `${baseUrl}/api/auth/vmwareCloudServices/handler/frame`
     where `baseUrl` is the URL where your Backstage backend can be reached;
     note that VMware Cloud does not support the combination of an `http://`
     scheme and a `localhost` hostname, so when testing locally it may help to
     set your backend base URL to `http://127.0.0.1:7007`.
   - `Refresh Token`: check `Issue refresh token`; refresh tokens are required
     to prevent forcing users to re-login when they refresh their browser.
   - `Define Scopes`: check `OpenID` at the bottom.
1. Click **Create**.
1. Take note of the `App ID` in the resulting modal; this is the client ID to be
   used by Backstage.

## Install the provider in the backend

### New backend system

Apps using the [new backend system](../../backend-system/index.md),
can enable the VMware Cloud provider with a small modification like:

```ts title="packages/backend-next/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-vmware-cloud-provider'),
);
/* highlight-add-end */
backend.start();
```

### Old backend system

This provider was added after the migration of the auth-backend plugin to the
new backend system, so no default provider factory was added. Because of this,
the installation procedure for old-style backends is slightly more involved:

```ts title="packages/backend/src/plugins/auth.ts"
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
/* highlight-add-start */
import {
  commonSignInResolvers,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import {
  vmwareCloudAuthenticator,
} from '@backstage/plugin-auth-backend-module-vmware-cloud-provider';
/* highlight-add-end */

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
      /* highlight-add-start */
      vmwareCloudServices: createOAuthProviderFactory({
        authenticator: vmwareCloudAuthenticator,
        signInResolver:
          commonSignInResolvers.emailLocalPartMatchingUserEntityName(),
      }),
      /* highlight-add-end */
```

In the above, `commonSignInResolvers.emailLocalPartMatchingUserEntityName()`
can be replaced with a more suitable resolver for the app in question.

## Configure Sign-in Resolution

See [Sign-in Identities and Resolvers](../identity-resolver.md) for details.

## Add to Sign-in Page

See the [Sign-In Configuration](../index.md#sign-in-configuration) docs for
general guidance, but as an example:

```tsx title="packages/app/src/App.tsx"
/* highlight-add-start */
import { vmwareCloudAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
/* highlight-add-end */

const app = createApp({
  /* highlight-add-start */
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        provider={{
          id: 'vmware-cloud-auth-provider',
          title: 'VMware Cloud',
          message: 'Sign in using VMware Cloud',
          apiRef: vmwareCloudAuthApiRef,
        }}
      />
    ),
  },
  /* highlight-add-end */
  // ..
});
```

## Configuration

Add the following to your `app-config.yaml` under the root `auth` configuration:

```yaml
auth:
  session:
    secret: your session secret
  environment: development
  providers:
    vmwareCloudServices:
      development:
        clientId: ${APP_ID}
        organizationId: ${ORG_ID}
```

where `APP_ID` refers to the ID retrieved when creating the OAuth App, and
`ORG_ID` is the [long ID of the
Organization](https://docs.vmware.com/en/VMware-Cloud-services/services/Using-VMware-Cloud-Services/GUID-CF9E9318-B811-48CF-8499-9419997DC1F8.html#view-the-organization-id-1)
in VMware Cloud for which you wish to enable sign-in.

Note that VMware Cloud requires OAuth Apps to use
[PKCE](https://oauth.net/2/pkce/) when performing authorization code flows; the
library used by this provider requires the use of Express session middleware to
do this. Therefore the value `your session secret` under `auth.session.secret`
should be replaced with a long, complex and unique string which will act as a
key for signing session cookies set by Backstage.

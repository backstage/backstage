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
1. Navigate to [Identity & Access Management > OAuth Apps](https://console.cloud.vmware.com/csp/gateway/portal/#/consumer/usermgmt/oauth-apps)
   and click the [Owned Apps](https://console.cloud.vmware.com/csp/gateway/portal/#/consumer/usermgmt/oauth-apps/owned-apps/view)
   tab -- if you are not an Organization Owner or Administrator but only a
   Member, you will not see this nav entry unless the **Developer** check box is
   selected for your role (see the [Organization roles and permissions](https://docs.vmware.com/en/VMware-Cloud-services/services/Using-VMware-Cloud-Services/GUID-C11D3AAC-267C-4F16-A0E3-3EDF286EBE53.html#organization-roles-and-permissions-0)
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
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/vmware-cloud/provider#resolvers for more resolvers
            - resolver: emailMatchingUserEntityProfileEmail
```

Where `APP_ID` refers to the ID retrieved when creating the OAuth App, and
`ORG_ID` is the [long ID of the Organization](https://docs.vmware.com/en/VMware-Cloud-services/services/Using-VMware-Cloud-Services/GUID-CF9E9318-B811-48CF-8499-9419997DC1F8.html#view-the-organization-id-1)
in VMware Cloud for which you wish to enable sign-in.

:::note Note

VMware Cloud requires OAuth Apps to use
[PKCE](https://oauth.net/2/pkce/) when performing authorization code flows; the
library used by this provider requires the use of Express session middleware to
do this. Therefore the value `your session secret` under `auth.session.secret`
should be replaced with a long, complex and unique string which will act as a
key for signing session cookies set by Backstage.

:::

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order, but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-vmware-cloud-provider
```

Then we will need to this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(
  import('@backstage/plugin-auth-backend-module-vmware-cloud-provider'),
);
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `vmwareCloudAuthApiRef` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).

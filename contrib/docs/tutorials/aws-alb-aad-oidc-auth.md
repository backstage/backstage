# Using AWS Application Load Balancer with Entra ID to authenticate requests

Backstage allows offloading the responsibility of authenticating users to an AWS Application Load Balancer (**ALB**), leveraging the authentication support on ALB.
This tutorial shows how to use authentication on an ALB sitting in front of Backstage.
Entra Id (formerly Azure Active Directory) is used as identity provider but any identity provider supporting OpenID Connect (OIDC) can be used.

It is assumed an ALB is already serving traffic in front of a Backstage instance configured to serve the frontend app from the backend.

## Infrastructure setup

### Entra App Registration

The App Registration is used to execute the authentication flow, serve and refresh the identity token.

Create the App following the steps outlined in `Create a Microsoft App Registration in Microsoft Portal` section from the tutorial [Monorepo App Setup With Authentication][monorepo-app-setup-with-auth].

Instead of `localhost` addresses, use the following values.

- Identifier URI: `https://backstage.yourdomain.com`
- Redirect URI: `https://backstage.yourdomain.com/oauth2/idpresponse`

`Application (client) Id`, `Directory (tenant) ID` and `client secret`values will be used while configuring the ALB.

### ALB

In the AWS console, configure ALB Authentication:

- Edit the ALB rule used to forward the traffic to Backstage and add a new `Authenticate` action. The action will have higher priority compared to the existing `Forward to`.
- Select `OIDC` under `Authenticate`
- Set `Issuer` to `https://login.microsoftonline.com/{TENANT_ID}/v2.0`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the App Registration.
- Set `Authorization endpoint` to `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the App Registration.
- Set `Token endpoint` to `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the App Registration.
- Set `User info endpoint` to `https://graph.microsoft.com/oidc/userinfo`
- Set `Client ID` to the App Registration `Application (client) Id`
- Set `Client secret` to the App Registration `client secret`

Use the following advanced settings:

- `Session cookie name` = `AWSELBAuthSessionCookie`
- `Session timeout` = `604800` seconds
- `Scope` = `openid profile offline_access`
- `Action on unauthenticated request` = `Autenticate (client reattempt)`

Once you've saved the action, you should see an authentication flow be triggered against Entra ID when visiting Backstage address at `https://backstage.yourdomain.com`. The flow will not complete successfully as the Backstage app isn't yet configured properly.

## Backstage changes

### Frontend

The Backstage App needs a SignInPage when authentication is required.
When using ALB authentication Backstage will only be loaded once the user has successfully authenticated; we won't need to display a SignIn page, however we will need to create a placeholder SignIn component that can refresh the token.

- edit `packages/app/src/App.tsx`
- import the following two additional definitions from `@backstage/core-plugin-api`: `useApi`, `configApiRef`; these will be used to check whether Backstage is running locally or behind an ALB
- add the following definition just before the app is created (`const app = createApp`):

```ts
import React from 'react';
import { UserIdentity } from '@backstage/core-components';
import { SignInPageProps } from '@backstage/core-app-api';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const SampleSignInComponent: any = (props: SignInPageProps) => {
  const [error, setError] = React.useState<string | undefined>();
  const config = useApi(configApiRef);
  React.useEffect(() => {
    const shouldAuth = !!config.getOptionalConfig('auth.providers.awsalb');
    if (shouldAuth) {
      fetch(`${window.location.origin}/api/auth/awsalb/refresh`)
        .then(data => data.json())
        .then(data => {
          props.onSignInSuccess(
            UserIdentity.fromLegacy({
              userId: data.backstageIdentity.id,
              profile: data.profile,
            }),
          );
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      try {
        props.onSignInSuccess(
          UserIdentity.fromLegacy({
            userId: 'guest',
            profile: {
              email: 'guest@example.com',
              displayName: 'Guest',
              picture: '',
            },
          }),
        );
      } catch (err: any) {
        setError(err.message as string);
      }
    }
  }, [config]);
  if (error) {
    return <div>{error}</div>;
  }
  return <div />;
};
```

- add `SampleSignInComponent` as `SignInPage`:

```ts
const app = createApp({
  ...
  components: {
    SignInPage: SampleSignInComponent,
    ...
  },
  ...
});
```

### Backend

When using ALB auth you can configure it as described [here](https://backstage.io/docs/auth/identity-resolver).

- replace the content of `packages/backend/plugin/auth.ts` with the below and tweak it according to your needs.

```ts
import { createRouter, providers } from '@backstage/plugin-auth-backend';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  database,
  config,
  discovery,
  tokenManager,
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    database,
    discovery,
    tokenManager,
    providerFactories: {
      awsalb: providers.awsAlb.create({
        authHandler: async ({ fullProfile }) => {
          let email: string | undefined = undefined;
          if (fullProfile.emails && fullProfile.emails.length > 0) {
            const [firstEmail] = fullProfile.emails;
            email = firstEmail.value;
          }

          let picture: string | undefined = undefined;
          if (fullProfile.photos && fullProfile.photos.length > 0) {
            const [firstPhoto] = fullProfile.photos;
            picture = firstPhoto.value;
          }

          const displayName: string | undefined =
            fullProfile.displayName ?? fullProfile.username ?? fullProfile.id;

          return {
            profile: {
              email,
              picture,
              displayName,
            },
          };
        },
        signIn: {
          resolver: async ({ profile }, ctx) => {
            if (!profile.email) {
              throw new Error('Profile contained no email');
            }

            const [id] = profile.email.split('@');
            if (!id) {
              throw new Error('Invalid email format');
            }

            const userRef = stringifyEntityRef({
              kind: 'User',
              name: id,
              namespace: DEFAULT_NAMESPACE,
            });

            const { token } = await ctx.issueToken({
              claims: {
                sub: userRef,
                ent: [userRef],
              },
            });

            return { id, token };
          },
        },
      }),
    },
  });
}
```

### Configuration

Use the following `auth` configuration when running Backstage on AWS:

```yaml
auth:
  providers:
    awsalb:
      issuer: https://login.microsoftonline.com/<TENANT_ID>/v2.0
      region: <AWS_REGION>
```

Replace `<TENANT_ID>` with the value of `Directory (tenant) ID` of the App Registration and `<AWS_REGION>` with the AWS region identifier where the ALB is deployed (for example: `eu-central-1`).

## Conclusion

Once it's deployed, after going through the Entra ID authentication flow, Backstage should display the Entra user details.

<!-- links -->

[monorepo-app-setup-with-auth-ms]: https://backstage.io/docs/auth/microsoft/provider

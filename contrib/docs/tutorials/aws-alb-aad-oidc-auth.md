# Using AWS Application Load Balancer with Azure Active Directory to authenticate requests

Backstage allows offloading the responsibility of authenticating users to an AWS Application Load Balancer (**ALB**), leveraging the authentication support on ALB.
This tutorial shows how to use authentication on an ALB sitting in front of Backstage.
Azure Active Directory (**AAD**) is used as identity provider but any identity provider supporting OpenID Connect (OIDC) can be used.

It is assumed an ALB is already serving traffic in front of a Backstage instance configured to serve the frontend app from the backend.

## Infrastructure setup

### AAD App

The AAD App is used to execute the authentication flow, serve and refresh the identity token.

Create the AAD App following the steps outlined in `Create a Microsoft App Registration in Microsoft Portal` section from the tutorial [Monorepo App Setup With Authentication][monorepo-app-setup-with-auth].

Instead of `localhost` addresses, use the following values.

- Identifier URI: `https://backstage.yourdomain.com`
- Redirect URI: `https://backstage.yourdomain.com/oauth2/idpresponse`

`Application (client) Id`, `Directory (tenant) ID` and `client secret`values will be used while configuring the ALB.

### ALB

In the AWS console, configure ALB Authentication:

- Edit the ALB rule used to forward the traffic to Backstage and add a new `Authenticate` action. The action will have higher priority compared to the existing `Forward to`.
- Select `OIDC` under `Authenticate`
- Set `Issuer` to `https://login.microsoftonline.com/{TENANT_ID}/v2.0`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the AAD App.
- Set `Authorization endpoint` to `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the AAD App.
- Set `Token endpoint` to `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize`, replacing `{TENANT_ID}` with the value of `Directory (tenant) ID` of the AAD App.
- Set `User info endpoint` to `https://graph.microsoft.com/oidc/userinfo`
- Set `Client ID` to the AAD App `Application (client) Id`
- Set `Client secret` to the AAD APP `client secret`

Use the following advanced settings:

- `Session cookie name` = `AWSELBAuthSessionCookie`
- `Session timeout` = `604800` seconds
- `Scope` = `openid profile offline_access`
- `Action on unauthenticated request` = `Autenticate (client reattempt)`

Once you've saved the action, you should see an authentication flow be triggered against AAD when visiting Backstage address at `https://backstage.yourdomain.com`. The flow will not complete successfully as the Backstage app isn't yet configured properly.

## Backstage changes

### Frontend

The Backstage App needs a SignInPage when authentication is required.
When using ALB authentication Backstage will only be loaded once the user has successfully authenticated; we won't need to display a SignIn page, however we will need to create a dummy SignIn component that can refresh the token.

- edit `packages/app/src/App.tsx`
- import the following two additional definitions from `@backstage/core-plugin-api`: `useApi`, `configApiRef`; these will be used to check whether Backstage is running locally or behind an ALB
- add the following definition just before the app is created (`const app = createApp`):

```ts
import React from 'react';
import { UserIdentity } from '@backstage/core-components';
import { SignInPageProps } from '@backstage/core-app-api';

const DummySignInComponent: any = (props: SignInPageProps) => {
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
      } catch (err) {
        setError(err.message);
      }
    }
  }, [config]);
  if (error) {
    return <div>{error}</div>;
  }
  return <div />;
};
```

- add `DummySignInComponent` as `SignInPage`:

```ts
const app = createApp({
  ...
  components: {
    SignInPage: DummySignInComponent,
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
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    logger,
    config,
    database,
    discovery,
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
          resolver: async ({ profile: { email } }, ctx) => {
            const [id] = email?.split('@') ?? '';
            // Fetch from an external system that returns entity claims like:
            // ['user:default/breanna.davison', ...]
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              namespace: DEFAULT_NAMESPACE,
              name: id,
            });

            // Resolve group membership from the Backstage catalog
            const fullEnt =
              await ctx.catalogIdentityClient.resolveCatalogMembership({
                entityRefs: [id].concat([userEntityRef]),
                logger: ctx.logger,
              });
            const token = await ctx.tokenIssuer.issueToken({
              claims: { sub: userEntityRef, ent: fullEnt },
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

Replace `<TENANT_ID>` with the value of `Directory (tenant) ID` of the AAD App and `<AWS_REGION>` with the AWS region identifier where the ALB is deployed (for example: `eu-central-1`).

## Conclusion

Once it's deployed, after going through the AAD authentication flow, Backstage should display the AAD user details.

<!-- links -->

[monorepo-app-setup-with-auth-ms]: https://backstage.io/docs/auth/microsoft/provider

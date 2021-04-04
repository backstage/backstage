# Using AWS Application Load Balancer with Azure Active Directory to authenticate requests

Backstage allows to offload the responsibility of authenticating users to AWS Application Loabalancer (ALB), leveraging the authentication support on ALB.
This tutorial shows how to use authentication on an ALB sitting in front of Backstage.
Azure Active Directory (AAD) is used as identity provider but any identity provider supporting OpenID Connect (OIDC) can be used.

It is assumed an ALB is already serving traffic in front of a Backstage instance configured to serve the frontend app from the backend.

## Infrastructure setup

### AAD App

The AAD App is used to execute the autentication flow, serve and refresh the identity token.

Create the AAD App following the steps outlined in `Create a Microsoft App Registration in Microsoft Portal` section from the tutorial [Monorepo App Setup With Authentication][monorepo-app-setup-with-auth].

Instead of `localhost` addresses use the following values.

- Identifier URI: `https://backstage.yourdomain.com`
- Redirect URI: `https://backstage.yourdomain.com/oauth2/idpresponse`

The values of `Application (client) Id`, `Directory (tenant) ID` and `client secret` will be used while configuring the ALB.

### ALB

In AWS console configure ALB Authentication as described below.

- Edit the ALB rule used to forward the traffic to Backstage and add a new `Authenticate` action, the action will have higher priority compared to the existing `Forward to`.
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

Once you've saved the action you should see an authentication flow be triggered against AAD when visiting Backstage address at `https://backstage.yourdomain.com`, the flow will not complete successfully as Backstage app isn't yet configured properly.

## Backstage changes

### Frontend

The Backstage App requires a SingInPage when authentication is required. When using ALB authentication Backstage will only be loaded once the user has successfully authenticated; we won't need to display a SignIn page, however we will need to create a dummy SignIn component that can refresh the token.

- edit `packages/app/src/App.tsx`
- import the following two additional definitions from `@backstage/core`: `useApi`, `configApiRef`; these will be used to check wether backstage is running locally or behind an ALB
- add the following definition just before the app is created (`const app = createApp`):

```ts
const DummySignInComponent: any = (props: any) => {

  const config = useApi(configApiRef);
  const shouldAuth = !!config.getOptionalConfig('auth.providers.awsalb');
  if (shouldAuth) {
    fetch(`${window.location.origin}/api/auth/awsalb/refresh`).then(data => data.json()).then((data) => {
      props.onResult({ userId: data.backstageIdentity.id, profile: data.profile })
    });
  } else {
    // when running locally we default user identity to `Local User`
    props.onResult({
      userId: "local user", profile: {
        email: "local.user@yourdomain.com",
        displayName: "Local User",
        picture: "",
      }
    })
  }

  return (
    <div />
  );
}
```

- use `DummySingInComponent` as `SignInPage` by changing `createApp` statement as follow:

```ts
const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: DummySignInComponent,
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
    bind(apiDocsPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  },
});
```

### Backend

When using ALB auth it is not possible to leverage the built-in auth config discovery mechanism implemented in the app created by default, a bespoke logic needs to be implemented.

- replace the content of `packages/backend/plugin/auth.ts` with the below

```ts
import { createRouter, AuthResponse, AuthProviderFactoryOptions, defaultAuthProviderFactories } from '@backstage/plugin-auth-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  database,
  config,
  discovery,
}: PluginEnvironment) {
  const identityResolver = (
    payload: any,
  ): Promise<AuthResponse<any>> => {
    return Promise.resolve({
      providerInfo: {},
      profile: {
        email: payload.email,
        displayName: payload.name,
        picture: payload.picture,
      },
      backstageIdentity: {
        id: payload.email,
      }
    });
  };
  const providerFactories = {
    awsalb: (options: AuthProviderFactoryOptions) => defaultAuthProviderFactories.awsalb({ ...options, identityResolver })
  }
  return await createRouter({ logger, config, database, discovery, providerFactories });
}
```

### Configuration

Use the following `auth` configuration when running Backstage on AWS.

```yaml
auth:
  providers:
   awsalb:
    issuer:
      issuer: https://login.microsoftonline.com/{TENANT_ID}/v2.0
      region: {AWS_REGION}
```

Replace `{TENANT_ID}` with the value of `Directory (tenant) ID` of the AAD App and `{AWS_REGION}` with the AWS region identifier where the ALB is deployed (ie: `eu-central-1`).

## Conclusion

Once the deployed, after having gone through the AAD authentication flow, Backstage should display the AAD user details.

Special thanks to [@backjo][gh-backjo] for implementing the `auth-backend` provider for AWS ALB on [#4047][pr-4047]


<!-- links -->
[monorepo-app-setup-with-auth-ms]: https://backstage.io/docs/tutorials/quickstart-app-auth#the-auth-configuration
[gh-backjo]: https://github.com/backjo
[pr-4047]: https://github.com/backstage/backstage/pull/4047
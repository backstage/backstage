Cloud Foundry (CF) is an open-source cloud application platform that makes it fast and easy to build, test, deploy, and scale apps in your choice language, framework, and cloud.

## Prerequisites & the Cloud Foundry CLI

This guide assumes a basic understanding of working on a Cloud Foundry environment, specifically using the CF CLI. See the [CF CLI Getting Started Guide](https://docs.cloudfoundry.org/cf-cli/getting-started.html) for more information.

## Getting Started

First, generate your own developer portal with Backstage by following the [Backstage getting started guide](https://backstage.io/docs/getting-started/).

Next, install the Cloud Foundry CLI and follow the instructions in the getting started guide to login to a Cloud Foundry environment.

Now you can get started configuring your Backstage instance to be deployable on Cloud Foundry.

From the top-level of your Backstage project, change directory into the `packages/backend` directory. Here you will create the CF `manifest.yml` app configuration file and modify the `package.json` file to be compatible with the CF Node.js [buildpack](https://docs.cloudfoundry.org/buildpacks/).

This is important because the [Node.js buildpack](https://github.com/cloudfoundry/nodejs-buildpack) [does not currently support newer versions of Yarn](https://github.com/cloudfoundry/nodejs-buildpack/pull/679); you need to modify the `package.json` to swap any references of `link:..` With `file:..`.

For example, update:

```
"dependencies": {
  ...
  "@backstage/plugin-techdocs-backend": "^1.10.9",
  "app": "link:../app",
  ...
},
```

to be:

```
"dependencies": {
  ...
  "@backstage/plugin-techdocs-backend": "^1.10.9",
  "app": "file:../app",
  ...
},
```

### Building Backstage

Build your Backstage instance by following the instructions below, based on the [Backstage Docker Build docs](https://backstage.io/docs/deployment/docker). Run the following command in the root directory of your backstage instance:

`yarn build:backend --config ../../app-config.yaml`

Following this, move the built Backstage to a new build directory:

```
cp -v \
  yarn.lock  \
  package.json  \
  packages/backend/dist/skeleton.tar.gz  \
  packages/backend/dist/bundle.tar.gz  \
  app-config.yaml \
  $BUILD_DIR
```

To use Yarn v1, create a new `.yarnrc` file in the build directory with the following content:

```
yarn-offline-mirror "./npm-packages-offline-cache"
yarn-offline-mirror-pruning true
```

In the build directory, untar the backstage packages and run `yarn install` to install npm dependencies into the yarn offline mirror directory:

```
cd $BUILD_DIR
tar xzf skeleton.tar.gz && rm skeleton.tar.gz
tar xzf bundle.tar.gz && rm bundle.tar.gz
yarn install
```

You can now run the built backstage instance locally, to verify it is working. Run the following command:

```
node packages/backend --config app-config.yaml
```

Open the `http://localhost:7007` in a browser to test your freshly built Backstage instance!

### Configuring for Cloud Foundry

Now that you have a working instance of Backstage, configure it to run on Cloud Foundry.

In the build directory, create a `manifest.yml` file to configure the app on Cloud Foundry, with the following content:

```
---
applications:
- name: APP_NAME
  memory: 1024M
  instances: 1
  buildpacks:
    - nodejs_buildpack
  command: node packages/backend --config app-config.yaml --config app-config.production.yaml
```

Where `APP_NAME` is your desired name for the app on Cloud Foundry.

Next, create an `app-config.production.yaml` file with the app's name and the default Cloud Foundry domain (`APPS_DOMAIN`). This enables running the application locally and on Cloud Foundry.

```
app:
  baseUrl: https://APP_NAME.APPS_DOMAIN

backend:
  baseUrl: https://APP_NAME.APPS_DOMAIN
  listen:
	port: ${PORT}
```

### Deploying to Cloud Foundry

Delete the `node_modules` directory, since you already created an offline npm package cache to push up along with the application:

```
rm -rf ./node_modules
```

Next push the application to the Cloud Foundry environment:

`cf push`

Once the push finishes, your Backstage instance is now running on Cloud Foundry! Navigate to the newly configured application's route at `https://APP_NAME.APPS_DOMAIN` in your browser.

## Advanced

### Authentication

[UAA (User Account and Authentication)](https://docs.cloudfoundry.org/concepts/architecture/uaa.html) is the OAuth2 provider for Cloud Foundry. To use Cloud Foundry's UAA as the Backstage authentication provider, create a custom OIDC Provider.

The following instructions are based on the [Backstage documentation for creating a custom OIDC provider](https://backstage.io/docs/auth/oidc/).

#### Prerequisite

The following steps utilize the UAA CLI (`uaac`). Installation and getting started can be found [here](https://docs.cloudfoundry.org/uaa/uaa-user-management.html). You will need to use `uaac` to login to your Cloud Foundry's UAA with a user capable of creating clients before continuing.

#### Steps

First create an API reference. This allows for dependency injection of our OIDC Auth API and gives a reference to our new provider API.

In `packages/app/src/apis.ts`:

```
export const uaaOIDCAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'oidc',
});
```

Next, create an API factory to create an instance of our custom OIDC API Provider.

In `packages/app/src/apis.ts`:

```
export const apis: AnyApiFactory[] = [
  ... // previous apis
  createApiFactory({
	api: uaaOIDCAuthApiRef,
	deps: {
  	discoveryApi: discoveryApiRef,
  	oauthRequestApi: oauthRequestApiRef,
  	configApi: configApiRef,
	},
	factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
  	OAuth2.create({
    	configApi,
    	discoveryApi,
    	oauthRequestApi,
    	provider: {
      	id: 'uaa-auth-provider',
      	title: 'UAA auth provider',
      	icon: () => null,
    	},
    	environment: configApi.getOptionalString('auth.environment'),
    	defaultScopes: ['openid','profile','email'],
  	}),
  }),
  ...
];
```

The provider logic is in the `backend` package. This allows you to create custom resolvers to check for existing users and issue tokens. As an administrator of your Backstage instance, you have multiple opportunities here. You can load users into Backstage and connect catalog users to UAA users via an email, for example. You can also allow users who have no Backstage access yet to login. Both will be covered below.

Create a `packages/backend/src/oidcProvider.ts` with the following:

```
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

export const uaaAuthProviderModule = createBackendModule({
	// This ID must be exactly "auth" because that's the plugin it targets
	pluginId: 'auth',
	// This ID must be unique, but can be anything
	moduleId: 'uaa-auth-provider',
	register(reg) {
  	reg.registerInit({
    	deps: { providers: authProvidersExtensionPoint },
    	async init({ providers }) {
      	providers.registerProvider({
        	// This ID must match the actual provider config, e.g. addressing
        	// auth.providers.azure means that this must be "azure".
        	providerId: 'uaa-auth-provider',
        	// Use createProxyAuthProviderFactory instead if it's one of the proxy
        	// based providers rather than an OAuth based one
        	factory: createOAuthProviderFactory({
          	// For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider
          	authenticator: oidcAuthenticator,
          	async signInResolver(info, ctx) {
            	if (!info.profile.email) {
                	throw new Error(
                    	'Login failed, user profile does not contain an email',
                	);
            	}
            	const userEntityRef = stringifyEntityRef({
              	kind: 'User',
              	name: info.profile.email,
            	});

            	try {
              	// we await here so that signInWithCatalogUser throws in the current `try`
              	return await ctx.signInWithCatalogUser({
                	filter: {
                  	'spec.profile.email': info.profile.email,
                	},
              	});
            	} catch (e) {
              	if (!(e instanceof NotFoundError)) {
                	throw e;
              	}
              	return ctx.issueToken({
                	claims: {
                  	sub: userEntityRef,
                  	ent: [userEntityRef],
                	},
              	});
            	}
          	},
        	}),
      	});
    	},
  	});
	},
  });

```

Reference your newly created custom provider with custom email resolver in `packages/backend/src/index.ts`:

```
...
backend.add(import('./oidcProvider'));
...
```

#### Configuration

In UAA, create a new OAuth client with scopes that give Backstage the following permissions:

- Ability for the UAA client to issue refresh tokens
- Obtain a user's `openid`, profile, and email
- Redirect back to the Backstage instance, after login

```
uaac client add UAA_CLIENT_ID --name backstage --scope "openid profile email" --authorized_grant_types "client_credentials refresh_token" --redirect_uri "https://APP_NAME.APPS_DOMAIN/**" -s UAA_CLIENT_SECRET
```

Next, add the newly-created authentication provider in `app-config.production.yaml`, with the UAA_CLIENT_ID and UAA_CLIENT_SECRET from above:

```
...
auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  allowGuestAccess: true
  session:
    secret: SESSION_SECRET // See https://backstage.io/docs/auth/auth0/provider for configuring this
  providers:
    guest: {} // Comment this out to remove guest access
	uaa-auth-provider:
  	development:
    	metadataUrl: https://UAA_URL/.well-known/openid-configuration
    	clientId: UAA_CLIENT_ID
    	clientSecret: UAA_CLIENT_SECRET
    	prompt: auto
...
```

Push the newly-configured Backstage instance with UAA authentication:

```
cf push
```

Congratulations! Once the push completes, you will have Backstage up and running with UAA authentication! 🎉

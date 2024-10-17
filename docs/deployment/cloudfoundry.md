---
id: cloudfoundry
title: Deploying to Cloud Foundry
sidebar_label: Cloud Foundry
description: How to deploy Backstage to Cloud Foundry
---

Cloud Foundry is an open source cloud application platform that makes it faster and easier to build, test, deploy, and scale apps in your choice of cloud, framework, and language.

## Prerequisites & the Cloud Foundry CLI

This guide assumes a basic understanding of working on a cloud foundry environment specifically using the cloud foundry CLI or CF CLI for short. See the [getting started guide](https://docs.cloudfoundry.org/cf-cli/getting-started.html) for more information.

## Getting Started

Build your own developer portal. Follow the getting started guide on backstage to get started. https://backstage.io/docs/getting-started/

Next, install the Cloud Foundry CLI and follow the instructions in the quickstart guide to login.

Once we are situated with an instance of backstage and our cloud foundry CLI we can get started in configuring the backstage instance to work with Cloud Foundry.

From the top level of your backstage project change directory into your backend packages folder. Here we will create our manifest.yml file as well as modify our package.json to accommodate our buildpack

This is important because the nodejs buildpack see [buildpacks](https://docs.cloudfoundry.org/buildpacks/) does not support newer versions of yarn. We need to modify our package.json to swap any references of `link:..` With `file:..`
Example to update:

```
"dependencies": {
  ...
  "@backstage/plugin-techdocs-backend": "^1.10.9",
  "app": "link:../app",
  ...
},

Example of updated packages/backend/package.json:

"dependencies": {
  ...
  "@backstage/plugin-techdocs-backend": "^1.10.9",
  "app": "file:../app",
  ...
},
```

### Building Backstage

Build your backstage instance following the instructions below taken from https://backstage.io/docs/deployment/docker. Run the following command in the root directory of your backstage instance

yarn build:backend --config ../../app-config.yaml

Following this we want to take the built backstage and place it in a new build directory

```
cp -v \
  yarn.lock  \
  package.json  \
  packages/backend/dist/skeleton.tar.gz  \
  packages/backend/dist/bundle.tar.gz  \
  app-config.yaml \
  $BUILD_DIR
```

Since backstage uses yarn berry (> v1.x.x) and the buildpack for Cloud Foundry only supports v1.x.x and below we need to create a new .yarnrc file in the build directory

```
.yarnrc
yarn-offline-mirror "./npm-packages-offline-cache"
yarn-offline-mirror-pruning true
```

Now we can change into the build directory and perform a yarn install to populate the yarn offline mirror directory to hydrate the npm dependencies necessary to run backstage. We also need to untar the backstage packages.

```
cd $BUILD_DIR
tar xzf skeleton.tar.gz && rm skeleton.tar.gz
tar xzf bundle.tar.gz && rm bundle.tar.gz
yarn install
```

Now we can try out the built backstage instance for testing. Run the following command and then open your browser to view backstage!

```
node packages/backend --config app-config.yaml
```

Open the following url: http://localhost:7007 to test your freshly built Backstage instance!

### Configuring for Cloud Foundry

Now that we have tested a freshly built instance of Backstage lets configure to run in the Cloud Foundry ecosystem.

Create a manifest.yml that will define the features of your backstage app within Cloud Foundry in the BUILD_DIR directory:

```
---
applications:
- name: backstage
  memory: 1024M
  instances: 1
  buildpacks:
    - nodejs_buildpack
  command: node packages/backend --config app-config.yaml --config app-config.production.yaml
```

Setup some environment variables locally to then configure your Cloud Foundry instance with

```
export BACKSTAGE_APP_NAME=appname
export APPS_DOMAIN=shared-domain.example.com
```

Create an env.vars file to pass up along with the application so these variables are set within cloud foundry as well.

vars.yml

```
BACKSTAGE_APP_NAME: appname
```

Then, create an app-config.production.yaml with the newly configured app name and cloud foundry domain. This will allow us to both run the application locally without cloud foundry and in production on cloud foundry with the configured base url for both the Backend and the App packages.

```
app:
  baseUrl: https://${BACKSTAGE_APP_NAME}.${APPS_DOMAIN}

backend:
  baseUrl: https://${BACKSTAGE_APP_NAME}.${APPS_DOMAIN}
  listen:
	port: ${PORT}
```

### Deploying to Cloud Foundry

We don’t want to include the node_modules directory since we created an offline cache to push up along with our application. We’ll want to remove it anyway to reduce network traffic before we cf-push

`rm -rf ./node_modules`

Next we will push the application up to our cloud foundry instance. We will use the no start flag because we have some environmental configuration we need to perform before we can start the app.

`cf push --vars-file ./vars.yml`

Once this finishes enjoy your new backstage instance living on the Cloud Foundry ecosystem! Navigate to the newly configured application and continue to login as a guest user.

## Advanced

### Authentication

UAA (User Account and Authentication) is an OAuth2 provider for user authentication in Cloud Foundry. https://docs.cloudfoundry.org/concepts/architecture/uaa.html In order to utilize users created in UAA for Cloud Foundry we are going to create a custom OIDC Provider to allow user authentication with the UAA OAuth2 login flow.

We are going to follow the instructions created for the custom OIDC provider documentation provided by backstage here. https://backstage.io/docs/auth/oidc/

### Prerequisite

This section of the document utilizes the UAA CLI (UAAC). Installation and getting started can be found here https://docs.cloudfoundry.org/uaa/uaa-user-management.html

First we will create an API reference. This allows for dependency injection of our OIDC Auth API and gives a reference to our new provider API.

```
packages/app/src/apis.ts
export const uaaOIDCAuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'oidc',
});
```

Next, we will create the API factory that references our custom UAA Auth Provider to create an instance of our OIDC API Provider.

```
packages/app/src/apis.ts
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

The provider logic itself lives in the backend package. This allows us to create custom resolvers to check for existing users and issue tokens. As an administrator of your backstage instance you have multiple opportunities here. You can load users into backstage and connect catalog users to UAA users via an email for example. You can also allow users who have no backstage access yet to login as well. We will show how to do both below.

Create a packages/backend/src/oidcProvider.ts with the following:

```
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';

const uaaAuthProviderModule = createBackendModule({
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

export default uaaAuthProviderModule;
```

Reference your newly created custom provider with custom email resolver in
packages/backend/src/index.ts

```
...
backend.add(import('./oidcProvider'));
...
```

### Configuration

Lastly we need to configure the newly created authentication provider within our app-config.production.yaml:

```
...
auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  allowGuestAccess: true
  session:
	secret: ${SESSION_SECRET}
  providers:
	guest: {} // Comment this out to remove guest access
	uaa-auth-provider:
  	development:
    	metadataUrl: https://${UAA_URL}/.well-known/openid-configuration
    	clientId: ${UAA_CLIENT_ID}
    	clientSecret: ${UAA_CLIENT_SECRET}
    	prompt: auto
...
```

In UAA we need to create a new client that utilizes the scopes that give us the following:
Ability for the OIDC Client to issue refresh tokens
Obtain the user’s openid, profile and email
Redirect back to the backstage instance upon login

```
uaac client add backstage --name backstage --scope "openid profile email" --authorized_grant_types "client_credentials refresh_token" --redirect_uri "https://${BACKSTAGE_APP_NAME}.${APPS_DOMAIN}/**" -s SECRET
```

Update the manifest.yml file to pass the uaa client id and secret to the UAA_CLIENT_ID and UAA_CLIENT_SECRET environment variables used in the app-config.production.yml file

manifest.yml

```
---
applications:
- name: backstage
  memory: 1024M
  instances: 1
  buildpacks:
	- nodejs_buildpack
  command: node packages/backend --config app-config.yaml
  env:
	uaa_url: https://login.(( .cloud_controller.system_domain.value ))
```

Update vars.yml

```
BACKSTAGE_APP_NAME: backstage
UAA_CLIENT_ID: CLIENTID
UAA_CLIENT_SECRET: SECRET
```

Perform another cf push to push up the newly configured backstage instance with UAA authentication.

```
cf push --vars-file ./vars.yml
```

Congratulations! Now you should have Backstage up and running! 🎉

---
id: provider
title: OpenShift Authentication Provider
sidebar_label: OpenShift
description: Adding OpenShift OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a OpenShift authentication
provider that can authenticate users using OpenShift OAuth.

## Use Case

This setup enables the Kubernetes integration to use the users rights to access the OpenShift clusters (OAuth 2.0 On-Behalf-Of / [Kubernetes Client Side Provider](https://backstage.io/docs/features/kubernetes/authentication/#client-side-providers)).

The users in Backstage are imported from LDAP using the [LDAP organizational data provider](https://backstage.io/docs/integrations/ldap/org).
The OpenShift OAuth server is connected to an SSO, which is also backed by the same LDAP service.

With this setup everything is aligned across services. The LDAP relative distinguished name (RDN) matches the name of the OpenShift user entity.

The OpenShift [built-in OAuth server](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/configuring-internal-oauth#oauth-server-metadata_configuring-internal-oauth) is based on OAuth 2.0. Therefore this Auth implementation builds on [passport-oauth2](https://github.com/jaredhanson/passport-oauth2)

## Create an OAuth client in OpenShift

Make sure that an OAuth client exists in the OpenShift cluster.

To configure the OpenShift integration, create an [`OAuthClient`](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/configuring-oauth-clients).

The redirect URI must be in the following format: `https://<fqdn>/api/auth/openshift/handler/frame`.

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    openshift:
      development:
        clientId: ${AUTH_OPENSHIFT_CLIENT_ID}
        clientSecret: ${AUTH_OPENSHIFT_CLIENT_SECRET}
        authorizationUrl: ${AUTH_OPENSHIFT_AUTHORIZATION_URL}
        tokenUrl: ${AUTH_OPENSHIFT_TOKEN_URL}
        openshiftApiServerUrl: ${OPENSHIFT_API_SERVER_URL}
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        # sessionDuration: 1d
        signIn:
          resolvers:
            - resolver: displayNameMatchingUserEntityName
```

The OpenShift provider is a structure with these configuration keys:

- `clientId`: The client ID of your OpenShift OAuth client, e.g., `my-backstage`
- `clientSecret`: The client secret tied to the OpenShift OAuth client.
- `authorizationUrl`: The OpenShift OAuth client auth endpoint, format: `https://<oauth-client-route>/oauth/authorize`.
- `tokenUrl`: The OpenShift OAuth client token endpoint, format: `https://<oauth-client-route>/oauth/token`.
- `openshiftApiServerUrl`: The OpenShift API server endpoint, format: `https://<openshift-api>`.
- `sessionDuration`: (optional): Lifespan of the user session.
- `signIn`: The configuration for the sign-in process, including the **resolvers**
  that should be used to match the user from the auth provider with the user
  entity in the Backstage catalog (typically a single resolver is sufficient).

The provider needs to use the scope **user:full**.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-openshift-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-openshift-provider'));
/* highlight-add-end */
```

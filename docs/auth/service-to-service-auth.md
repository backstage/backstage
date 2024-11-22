---
id: service-to-service-auth
title: Service to Service Auth
# prettier-ignore
description: This section describes service to service authentication works, both internally within Backstage plugins and when external callers want to make requests.
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage
[version 1.24](../releases/v1.24.0.md). If you are still on the old backend
system, you may want to read [its own article](./service-to-service-auth--old.md)
instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

This article describes how _service-to-service auth_ works in Backstage, both
between Backstage backend plugins and for external callers who want to make
requests to them. This is in contrast to _user and user-to-service auth_ which
use different flows.

Each section describes one distinct type of auth flow.

## Standard Plugin-to-Plugin Auth

Backstage plugins that use the new backend system and handle credentials using
the `auth` and `httpAuth` service APIs are secure by default, without requiring
any configuration. They generate self-signed tokens automatically for making
requests to other Backstage backend plugins, and the receivers use the caller's
public key set endpoint to be able to perform verification.

A backend plugin wishing to make a request to another backend plugin acquires
the required token as follows, where `auth` and `httpAuth` are assumed to be
injected from `coreServices.auth` and `coreServices.httpAuth`, respectively:

```ts
const credentials = await httpAuth.credentials(req);
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: credentials,
  targetPluginId: '<plugin-id>', // e.g. 'catalog'
});
```

In this example we are assuming that we are in an Express request handler, and
we extract the caller credentials (typically a user or a service) out of its
`req` and make the upstream request on-behalf-of that principal. Prefer to use
this pattern wherever there's an incoming set of credentials to refer to.

If you want to initiate a request entirely as your own service, not on behalf of
anybody else, you can do so as follows:

```ts
const { token } = await auth.getPluginRequestToken({
  onBehalfOf: await auth.getOwnServiceCredentials(),
  targetPluginId: '<plugin-id>', // e.g. 'catalog'
});
```

Callers pass along the tokens verbatim with requests in the `Authorization`
header:

```yaml
Authorization: Bearer eyJhbG...
```

You may occasionally also see some code, e.g. clients to other systems, that
accept a `credentials` argument directly instead of a token. For those, just
pass in the credentials as acquired above, instead of making a token. The client
code will know what to do with those credentials internally.

This flow has only one configuration option to set in your app-config:
`backend.auth.dangerouslyDisableDefaultAuthPolicy`, which can be set to `true`
if you for some reason need to completely disable both the issuing and
verification of tokens between backend plugins. This makes your backends
insecure and callable by anyone without auth, so only use this as a last resort
and when your deployment is behind a secure ingress like a VPN.

External callers cannot leverage this flow; it's only used internally by backend
plugins calling other backend plugins.

### Static Keys for Plugin-to-Plugin Auth

In some special circumstances, such as when running worker nodes on readonly
database replicas, you may wish to opt out of the standard database based
public-key scheme. As an alternative, you can put static keys in your config
that are used for token signing and validation.

You can make keys using the `openssl` command line utility.

- First generate a private key using the ES256 algorithm:

  ```sh
  openssl ecparam -name prime256v1 -genkey -out private.ec.key
  ```

- Convert it to PKCS#8 format:

  ```sh
  openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.ec.key -out private.key
  ```

- Extract the public key:

  ```sh
  openssl ec -inform PEM -outform PEM -pubout -in private.key -out public.key
  ```

After this you have the files `private.key` and `public.key`. Put them in a
place where you know their absolute paths, and then set up your app-config
accordingly:

```yaml
backend:
  auth:
    # This is the new section for configuring plugin-to-plugin key storage
    pluginKeyStore:
      type: static
      static:
        keys:
          - publicKeyFile: /absolute/path/to/public.key
            privateKeyFile: /absolute/path/to/private.key
            keyId: some-custom-id
```

As long as all your nodes have this same config with the same set of keys, they
will now be able to successfully communicate with each other without touching the
database.

You'll note that the `keys` value is an array, which is useful for key rotation.
The first entry will always be used for signing, but any of the subsequent
entries will also be used for token validation. This lets you have a period of
time where tokens signed by the previous top entry are still accepted by
receivers, by just inserting your new key pair as the top entry and leaving the
old ones intact. You can remove old private keys however; those won't be used.

## Static Tokens

This access method consists of random static tokens that can be handed out to
external callers who want to make requests to Backstage backend plugins. This is
useful for the most basic callers such as command line scripts, web hooks and
similar.

You configure this access method by adding one or more entries of type `static`
to the `backend.auth.externalAccess` app-config key:

```yaml title="in e.g. app-config.production.yaml"
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${CICD_TOKEN}
          subject: cicd-system-completion-events
        # Restrictions are optional; see below
        accessRestrictions:
          - plugin: events
      - type: static
        options:
          token: ${ADMIN_CURL_TOKEN}
          subject: admin-curl-access
```

The tokens can be any string without whitespace, but for security reasons should
be sufficiently long so as not to be easy to guess by brute force. You can for
example generate them on the command line:

```shell
node -p 'require("crypto").randomBytes(24).toString("base64")'
```

The subjects must be strings without whitespace. They are used for identifying
each caller, and become part of the credentials object that request recipient
plugins get.

Callers must pass along tokens verbatim with requests in the `Authorization`
header when calling Backstage plugins:

```yaml
Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
```

## JWKS Token Auth

This access method allows for external caller token authentication using configured
JSON Web Key Sets (JWKS). This is useful for callers that are authenticating to our
instance of Backstage with third-party tools, such as Auth0.

You can configure this access method by adding one or more entries of type `jwks`
to the `backend.auth.externalAccess` app-config key:

```yaml title="in e.g. app-config.production.yaml"
backend:
  auth:
    externalAccess:
      - type: jwks
        options:
          url: https://example.com/.well-known/jwks.json
          issuer: https://example.com
          algorithm: RS256
          audience: example, other-example
          subjectPrefix: custom-prefix
      - type: jwks
        options:
          url: https://another-example.com/.well-known/jwks.json
          issuer: https://example.com
```

The URL should point at an unauthenticated endpoint that returns the JWKS.

`issuer` specifies the issuer(s) of the JWT that the authenticating app will accept.
Passed JWTs must have an `iss` claim which matches one of the specified issuers.

`algorithm` specifies the algorithm(s) that are used to verify the JWT. The passed JWTs
must have been signed using one of the listed algorithms.

`audience` specifies the intended audience(s) of the JWT. The passed JWTs must have an "aud"
claim that matches one of the audiences specified, or have no audience specified.

For additional details regarding the JWKS configuration, please consult your authentication
provider's documentation.

The subject returned from the token verification will become part of the
credentials object that the request recipient plugins get. All subjects will have the prefix
`external:`, but you can also provide a custom subjectPrefix which will get appended before the
subject returned from your JWKS service (ex. `external:custom-prefix:sub`).

Callers must pass along tokens with requests in the `Authorization` header when
calling Backstage plugins:

```yaml
Authorization: Bearer eyJhbG...
```

## Legacy Tokens

Plugins and backends that are _not_ on the new backend system use a legacy token
flow, where shared static secrets in your app-config are used for signing and
verification. If you are on the new backend system and are not using legacy
plugins using the compatibility wrapper, you can skip this section.

### Configuration (legacy)

In local development, there is no need to configure anything for this auth
method. But in production, you must configure at least one legacy type external
access method:

```yaml title="in e.g. app-config.production.yaml"
backend:
  auth:
    externalAccess:
      - type: legacy
        options:
          secret: my-secret-key-catalog
          subject: legacy-catalog
      - type: legacy
        options:
          secret: my-secret-key-scaffolder
          subject: legacy-scaffolder
```

The old style keys config is also supported as an alternative, but please
consider using the new style above instead:

```yaml title="in e.g. app-config.production.yaml"
backend:
  auth:
    keys:
      - secret: my-secret-key-catalog
      - secret: my-secret-key-scaffolder
```

The secrets must be any base64-encoded random data, but for security reasons
should be sufficiently long so as not to be easy to guess by brute force. You
can for example generate them on the command line:

```shell
node -p 'require("crypto").randomBytes(24).toString("base64")'
```

The subjects must be strings without whitespace. They are used for identifying
each caller, and become part of the credentials object that request recipient
plugins get.

In both of the examples we showed two secrets being specified, but the minimum
is one. The order is significant: the first one is always used for signing of
outgoing requests to other backend plugins, while all of the keys are used for
verification. This is useful if you want to be able to have unique keys per
deployment if you are using split deployments of Backstage. Then each deployment
lists its own signing secret at the top, and only adds the secrets for those
other deployments that it wants to permit to call it.

For most organizations, we recommend leaving it at just one key and
[migrating](../backend-system/building-backends/08-migrating.md) to the new
backend system as soon as possible instead of experimenting with multiple legacy
secrets.

### External Callers (legacy)

For legacy Backstage backend plugins, the above configuration is enough. But
external callers who wish to make requests using this flow must generate tokens
according to the following rules.

The token must be a JWT with a `HS256` signature, using the raw base64 decoded
value of the configured key as the secret. It must also have the following
payload:

- `sub`: the exact string "backstage-server"
- `exp`: one hour from the time it was generated, in epoch seconds

:::note Note

The JWT must encode the `alg` header as a protected header, such as with
[setProtectedHeader](https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#setprotectedheader).

:::

The caller then passes along the JWT token with requests in the `Authorization`
header:

```yaml
Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
```

## Access Restrictions

Each `externalAccess` entry may optionally have an `accessRestrictions` key,
which limits what that particular access method can do. Let's look at an
example:

```yaml title="in e.g. app-config.production.yaml"
backend:
  auth:
    externalAccess:
      - type: static
        options:
          token: ${CICD_TOKEN}
          subject: cicd-system-completion-events
        accessRestrictions:
          - plugin: events
```

In this short example there's only one entry. It says that for anyone trying to
make access with the CICD token, they will be rejected if they try to contact
anything but the `events` backend plugin. You could add additional entries to
the array that allow targeting more plugins if that's what you want.

:::note Note

If no `accessRestrictions` are added, the access method has unlimited access to
all functionality of all plugins. It is recommended that you try to specify
access restrictions whenever possible, to reduce risk.

:::

Each entry has one or more of the following fields:

- **`plugin`**: Required. A plugin ID as a string, for example `'catalog'`. Permits
  access to make requests to this plugin. Can be further refined by setting
  additional fields as per below.

  Example:

  ```yaml
  accessRestrictions:
    # access to any other plugin will be rejected
    - plugin: my-plugin
  ```

- **`permission`**: Optional. A collection (comma/space separated string or
  string array) of permission names. If given, this method is limited to only
  performing actions with these named permissions in the plugin with the ID
  given above.

  Note that this only applies where permissions checks are enabled in the first
  place. Endpoints that are not protected by the permissions system at all, are
  not affected by this setting.

  Example:

  ```yaml
  accessRestrictions:
    - plugin: my-plugin
      # Any other permission check will be rejected.
      permission:
        - my-plugin.add-item
        - my-plugin.remove-item
      # Also supports the shorthand form:
      # permission: my-plugin.add-item, my-plugin.remove-item
  ```

- **`permissionAttribute`**: Optional. A key-value object of permission attributes
  where each value is a collection (comma/space separated string or string
  array) of allowed such values. If given, this method is limited to only
  performing actions whose permissions have these attributes.

  Note that this only applies where permissions checks are
  enabled in the first place. Endpoints that are not protected by
  the permissions system at all, are not affected by this
  setting.

  In practice, this is typically used to limit by the `action` attribute, for
  `'create'`, `'read'`, `'update'`, or `'delete'` values.

  Example:

  ```yaml
  accessRestrictions:
    - plugin: my-plugin
      permissionAttribute:
        # Updates and deletes will be rejected.
        action:
          - create
          - read
        # Also supports the shorthand form:
        # action: create, read
  ```

## Adding custom or logic for validation and issuing of tokens

The `pluginTokenHandlerDecoratorServiceRef` can be used to decorate the existing token handler without having to re-implement the entire `PluginTokenHandler`.
This is particularly useful when you want to add additional logic to the handler, such as logging or metrics or custom token validation.

The `PluginTokenHandler` interface has two methods:

- `issueToken`: This method is used to issue a token for a plugin. It takes in the `pluginId` and `targetPluginId` as arguments, and an optional `limitedUserToken` object which can be used to issue a token on behalf of another user. The method returns a promise that resolves to an object containing the issued token.

- `verifyToken`: This method is used to verify a token. It takes in the token as an argument and returns a promise that resolves to an object containing the subject of the token and an optional limited user token.

```ts
import {
  PluginTokenHandler,
  pluginTokenHandlerDecoratorServiceRef,
} from '@backstage/backend-defaults/auth';
import { createServiceFactory } from '@backstage/backend-plugin-api';

const decoratedPluginTokenHandler = createServiceFactory({
  service: pluginTokenHandlerDecoratorServiceRef,
  deps: {},
  async factory() {
    return (defaultImplementation: PluginTokenHandler) =>
      new CustomTokenHandler(defaultImplementation);
  },
});
```

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

This flow has only one configuration option to set in your app-config:
`backend.auth.dangerouslyDisableDefaultAuthPolicy`, which can be set to `true`
if you for some reason need to completely disable both the issuing and
verification of tokens between backend plugins. This makes your backends
insecure and callable by anyone without auth, so only use this as a last resort
and when your deployment is behind a secure ingress like a VPN.

External callers cannot leverage this flow; it's only used internally by backend
plugins calling other backend plugins.

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

Callers pass along the tokens verbatim with requests in the `Authorization`
header:

```yaml
Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
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

> NOTE: The JWT must encode the `alg` header as a protected header, such as with
> [setProtectedHeader](https://github.com/panva/jose/blob/main/docs/classes/jwt_sign.SignJWT.md#setprotectedheader).

The caller then passes along the JWT token with requests in the `Authorization`
header:

```yaml
Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
```

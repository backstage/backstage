---
'@backstage/plugin-proxy-backend': minor
---

**BREAKING**: The proxy backend plugin is now protected by Backstage auth, by
default. Unless specifically configured (see below), all proxy endpoints will
reject requests immediately unless a valid Backstage user or service token is
passed along with the request. This aligns the proxy with how other Backstage
backends behave out of the box, and serves to protect your upstreams from
unauthorized access.

A proxy configuration section can now look as follows:

```yaml
proxy:
  endpoints:
    '/pagerduty':
      target: https://api.pagerduty.com
      credentials: require # NEW!
      headers:
        Authorization: Token token=${PAGERDUTY_TOKEN}
```

There are three possible `credentials` settings at this point:

- `require`: Callers must provide Backstage user or service credentials with
  each request. The credentials are not forwarded to the proxy target.
- `forward`: Callers must provide Backstage user or service credentials with
  each request, and those credentials are forwarded to the proxy target.
- `dangerously-allow-unauthenticated`: No Backstage credentials are required to
  access this proxy target. The target can still apply its own credentials
  checks, but the proxy will not help block non-Backstage-blessed callers. If
  you also add `allowedHeaders: ['Authorization']` to an endpoint configuration,
  then the Backstage token (if provided) WILL be forwarded.

The value `dangerously-allow-unauthenticated` was the old default.

The value `require` is the new default, so requests that were previously
permitted may now start resulting in `401 Unauthorized` responses. If you have
`backend.auth.dangerouslyDisableDefaultAuthPolicy` set to `true`, this does not
apply; the proxy will behave as if all endpoints were set to
`dangerously-allow-unauthenticated`.

If you have proxy endpoints that require unauthenticated access still, please
add `credentials: dangerously-allow-unauthenticated` to their declarations in
your app-config.

# Proxy backend plugin

This is the backend plugin that enables proxy definitions to be declared in,
and read from, `app-config.yaml`.

Relies on the `http-proxy-middleware` package.

## Getting Started

This backend plugin can be started in a standalone mode from directly in this package
with `yarn start`. However, it will have limited functionality and that process is
most convenient when developing the plugin itself.

The proxy is already installed in the Backstage backend per default, so you can also
start up the full example backend to experiment with the proxy.

```bash
yarn workspace example-backend start
```

## Configuration

See [the proxy docs](https://backstage.io/docs/plugins/proxying).

## Links

- [Call Existing API](https://backstage.io/docs/plugins/call-existing-api) helps the
  decision process of what method of communication to use from a frontend plugin to
  your API
- [The proxy plugin documentation](https://backstage.io/docs/plugins/proxying) describes
  configuration options and more
- [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware)

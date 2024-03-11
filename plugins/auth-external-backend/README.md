# auth-external

Welcome to the auth-external backend plugin!

## Providing tokens

This plugin allows to fetch authentication token to be used with Backstage plugin APIs from
external services.

To start, you must define services that can get the token to the `app-config.yaml`:

```yaml
auth:
  external:
    # X-Api-Key header for the service
    - apiKey: MySecretApiKey
      # External service name
      name: externalService
      # Optional whitelist of allowed plugins this service can call. Defaults to all plugins.
      allowedPlugins:
        - notifications
        - catalog
```

## Fetching tokens

The external service must call `GET /auth-external/token/:pluginId` endpoint to fetch the token.
The request must have `X-Api-Key` header that matches the configuration `apiKey` value.
The `pluginId` path parameter is necessary to identify which plugin the service is about to call.

The successful response will contain the token that can be used to call the plugin API:

```json
{ "token": "abcd1234" }
```

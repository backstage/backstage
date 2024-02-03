## Discovering your other backends

> Note: you must be on the new backend for this to work.

To start, you need to identify a backend that will be the primary gateway for all discovery requests. This backend will know all routing information about your deployment, which services are installed across the deployment and where. We will call this your Backend Gateway. Then you need your other Backstage instances, we'll call these Backend A-Z. Your Backend Gateway can also be a regular instance, this is not a heavy traffic load.

### Setting up your Backend Gateway

If you're using the latest `rootFeatureRegistryService` and `discoveryService`, all you need to do is

```shell
# in backend/src/index.ts
yarn add @backstage/plugin-discovery-backend
```

and then add it to your `backend/src/index.ts` like so,

```ts
backend.add(import('@backstage/plugin-discovery-backend'));
```

That's it.

### Setting up Backend A-Z

Each backend will need a separate config. That config will contain information about the URLs of each instance and a pointer to the primary gateway instance. Do that like so,

```yaml
backend:
  baseUrl: http://myBaseUrl.com # should be the internal URL, this will only be visible on the backend.

discovery:
  gatewayUrl:
    internal: http://my-gateway.internal
    external: https://gateway.backstage.mysite.com # should match the main backend.baseUrl for Backend Gateway
```

Everything else should be taken care of.

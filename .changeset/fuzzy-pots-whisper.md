---
'@backstage/backend-common': patch
---

It's possible to customize the request logging handler when building the service. For example in your `backend`

```
  const service = createServiceBuilder(module)
    .loadConfig(config)
    .setRequestLoggingHandler((logger?: Logger): RequestHandler => {
      const actualLogger = (logger || getRootLogger()).child({
        type: 'incomingRequest',
      });
      return expressWinston.logger({ ...
```

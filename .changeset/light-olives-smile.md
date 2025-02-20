---
'@backstage/backend-defaults': patch
---

Expose a static method on the DatabaseManager, that takes callback functions to alter Knex.Config based on configured connection type.

Example:

Before creating an instance of the DatabaseManager (in the databaseServiceFactory) a callback method can be registered,
The callback is called upon DatabaseClientCreation for the registered connection.type

### Example transformer

```typescript
export async function myCustomTransformer(
  config: Knex.Config,
): Promise<Knex.Config> {
  if (
    !config.connection ||
    typeof config.connection === 'string' ||
    typeof config.connection === 'function'
  ) {
    throw new Error(`myCustomTransformer can not handle this`);
  }
  const secret = (config.connection as any).secret;
  const token = callMyTokenEndpoint(secret);
  config.connection.password = token;
  return config;
}
```

### Register transformer

```typescript
//Do this before DatabaseManager.fromConfig()
DatabaseManager.addConfigTransformer(
  'pg',
  'special-authentication',
  myTokenProvider,
);
```

### trigger transformer

```yaml
...
backend:
  ...
  database:
    client: pg
    connection:
      type: special-authentication
      secret: ${APPLICATION-CLIENT-ID}
      ...
```

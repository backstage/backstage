# Identity Backend Plugin

This plugin provides some interfaces to identity the logged in user in the Backstage Backend API. It also exposes a new API /identity/user to retrieve the currently logged in user.

```typescript
class MyIdentityProvider implements IdentityProvider {
  userFromRequest(request: express.Request): BackstageIdentity | undefined {
    const token = request.headers.authorization?.match(/Bearer\s+(\S+)/i)?.[1];

    if (!token) return undefined;

    const [_header, rawPayload, _signature] = token.split('.');
    const payload: { sub: string } = JSON.parse(
      Buffer.from(rawPayload, 'base64').toString(),
    );

    return {
      entityRef: payload.sub,
      token,
    };
  }
}
```

If you would like to mount your own API to determine the logged in user:

```typescript
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    identityProvider: env.identityProvider,
  });
}
```

You can use the IdentityProvider in any backend you prefer to identify the user using this identity.

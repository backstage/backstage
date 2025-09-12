# @backstage/plugin-user-settings-node

This package contains a service `UserSettingsService` exposed as `userSettingsServiceRef`, which can be used by backend plugins to query and manage user settings for a specific user.

Use this from a plugin that is created like this:

```ts
export const myPlugin = createBackendPlugin({
  pluginId: 'my-custom-plugin',
  register(env) {
    env.registerInit({
      deps: {
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        userSettingsService: userSettingsServiceRef,
      },
      async init({ auth, httpAuth, httpRouter, userSettingsService }) {
        httpRouter.use(
          await createRouter({
            auth,
            httpAuth,
            userSettingsService,
          }),
        );
      },
    });
  },
});
```

With a `createRouter` like:

```ts
const createRouter = ({
  auth,
  httpAuth,
  userSettingsService,
}: {
  auth: AuthService;
  httpAuth: HttpAuthService;
  userSettingsService: UserSettingsService;
}) => {
  const router = express.Router();

  router.get('/do-something', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const { token } = await auth.getPluginRequestToken({
      targetPluginId: 'user-settings',
      onBehalfOf: credentials,
    });
    const setting = await userSettingsService.get(token, 'the-key');

    // `setting.value` is the value of the setting
    doSomethingWith(setting.value);

    res.json({}).end();
  });

  return router;
};
```

## API

The API of the `UserSettingsService` is similar to the frontend `StorageApi`, except the functions in `UserSettingsService` need a `userToken` parameter for each call.

## Configuration

Each key is stored in a bucket (a string), which defaults to `default`. This can be configured using:

```yaml
userSettings:
  namespace: my-namespace
```

The configuration applies to both the frontend (`storageApiRef`) and this backend service.

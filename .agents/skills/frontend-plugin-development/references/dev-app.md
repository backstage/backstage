# Dev app

Read when setting up or fixing a plugin's `dev/index.tsx`, or when the plugin needs APIs that are not provided when it runs on its own.

## Use `@backstage/frontend-dev-utils`

Plugins on the new frontend system use `createDevApp` from `@backstage/frontend-dev-utils`. The `createDevApp` from `@backstage/dev-utils` is for old-system plugins and its types do not accept new-system ones.

```tsx
// dev/index.tsx
import { createDevApp } from '@backstage/frontend-dev-utils';
import myPlugin from '../src';

createDevApp({ features: [myPlugin] });
```

Replace `@backstage/dev-utils` with `@backstage/frontend-dev-utils` in `devDependencies`, and run it with `yarn start` from the plugin directory.

`createDevApp` installs the app plugin with sign-in disabled, so the core APIs (`configApiRef`, `discoveryApiRef`, `fetchApiRef`, `identityApiRef`, `errorApiRef`, `storageApiRef`, and the other `core.*` refs) are already provided. It also accepts `bindRoutes` for the plugin's external routes.

## Provide the APIs the plugin uses

Every API a component reads with `useApi` must have an implementation in the app, or the component throws on mount:

```
NotImplementedError: No implementation available for apiRef{plugin.other.client}
```

The plugin's own APIs are provided by its `ApiBlueprint` extensions. APIs owned by other plugins are only there if those plugins are installed. For the dev app, either add the owning plugin to `features`, or provide a fake in a module. A separate `dev/devApis.ts` lets the [smoke test](testing.md#add-a-plugin-smoke-test) reuse it:

```ts
// dev/devApis.ts
import {
  ApiBlueprint,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import { otherApiRef } from '@example/plugin-other-react';
import { FakeOtherClient } from './FakeOtherClient';

export const devApis = createFrontendModule({
  pluginId: 'my-plugin',
  extensions: [
    ApiBlueprint.make({
      name: 'other',
      params: defineParams =>
        defineParams({
          api: otherApiRef,
          deps: {},
          factory: () => new FakeOtherClient(),
        }),
    }),
  ],
});
```

```tsx
// dev/index.tsx
createDevApp({ features: [myPlugin, devApis] });
```

- Each `ApiBlueprint` in the module needs a unique `name`.
- When porting an old `createDevApp().registerApi(...)` chain, port every call. Dropping one compiles but throws `NotImplementedError` when the component that uses the API mounts.
- Do not provide `core.*` APIs again. They are owned by the app plugin, so another provider is rejected with `API_FACTORY_CONFLICT: API 'core.discovery' is already provided by plugin 'app', cannot also be provided by 'my-plugin'`, which shows the app error page.
- Skip the module when the plugin only uses core APIs and its own APIs.
- Remove a fake once you add the plugin that owns the API to `features`. The owner's implementation wins, and the conflict shows the app error page.

To find what needs providing, search the plugin's runtime code (not tests) for `useApi(` and `apis.get(` and list the refs that are neither `core.*` nor provided by the plugin itself.

See [Utility APIs](https://backstage.io/docs/frontend-system/utility-apis/) for API ownership and overrides.

---
'@backstage/core-compat-api': patch
---

Added a new `convertLegacyAppOptions` helper that converts many of the options passed to `createApp` in the old frontend system to a module with app overrides for the new system. The supported options are `apis`, `icons`, `plugins`, `components`, and `themes`.

For example, given the following options for the old `createApp`:

```ts
import { createApp } from '@backstage/app-deafults';

const app = createApp({
  apis,
  plugins,
  icons: {
    custom: MyIcon,
  },
  components: {
    SignInPage: MySignInPage,
  },
  themes: [myTheme],
});
```

They can be converted to the new system like this:

```ts
import { createApp } from '@backstage/frontend-deafults';
import { convertLegacyAppOptions } from '@backstage/core-compat-api';

const app = createApp({
  features: [
    convertLegacyAppOptions({
      apis,
      plugins,
      icons: {
        custom: MyIcon,
      },
      components: {
        SignInPage: MySignInPage,
      },
      themes: [myTheme],
    }),
  ],
});
```

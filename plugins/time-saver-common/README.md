# Time Saver - common

This plugin provides an implementation of charts and statistics related to your time savings that are coming from usage of your templates. Plugins is built from frontend and backend part. Backend plugin is responisble for scheduled stats parsing process and data storage.

## Dependencies

- [time-saver](./time-saver)
- [time-saver-backend](./time-saver-backend)

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/backstage-plugin-time-saver-common
```

or

```sh
# From your Backstage root directory
yarn add --cwd packages/app @backstage/backstage-plugin-time-saver-common
```

2. Wire up the API implementation to your App.tsx:

```tsx
import { timeSaverPermission } from 'backstage-plugin-time-saver-common';

...

    <Route
      path="/time-saver"
      element={
        <RequirePermission permission={timeSaverPermission}>
          <TimeSaverPage />
        </RequirePermission>
      }
    />

```

2. Wire up in the navigation pane the in component/Root/Root.tsxs:

```tsx

import { timeSaverPermission } from 'backstage-plugin-time-saver-common';

...

        <RequirePermission
          permission={timeSaverPermission}
          errorPage={<></>}
        >
          <SidebarItem
            icon={Timelapse}
            to="time-saver"
            text="TimeSaver"
          />
        </RequirePermission>
```

```ts
import { timeSaverPermission } from 'backstage-plugin-time-saver-common';

...

    if (isPermission(request.permission, timeSaverPermission)) {
      if (isAdmin) { //example condition
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
      return {
        result: AuthorizeResult.DENY,
      };
    }

```

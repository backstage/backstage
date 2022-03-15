# Google calendar plugin

Plugin displays events from google calendar

## Getting started

The plugin exports `HomePageCalendar` widget for the Homepage.
If your homepage is not static JSX add `gcalendarApiRef` to the App's `apis.ts`:

```ts
import {
  GCalendarApiClient,
  gcalendarApiRef,
} from '@backstage/plugin-gcalendar';

export const apis = [
  // ...
  createApiFactory({
    api: gcalendarApiRef,
    deps: { authApi: googleAuthApiRef, fetchApi: fetchApiRef },
    factory: deps => new GCalendarApiClient(deps),
  }),
];
```

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

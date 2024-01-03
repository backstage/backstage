# Notifications

This Backstage front-end plugin provides:

- the Notifications page listing notifications from the logged-in user's perspective
- the NotificationsApi for accessing the notifications backend from front-end plugins
- an active item to the main left side menu to both notify the user about new messages and provide navigation to the Notifications page
- an alert about new system notifications

## Getting started

### Prerequisities

Have `@backstage/plugin-notifications-backend` installed and running.

### Add NPM dependency

```
cd packages/app
yarn add @backstage/plugin-notifications-frontend
```

### Add left-side menu item

In the `packages/app/src/components/Root/Root.tsx`:

```
import { NotificationsSidebarItem } from '@backstage/plugin-notifications-frontend';

...
export const Root = ({ children }: PropsWithChildren<{}>) => (
    ...
      {/* New code: */}
      <SidebarDivider />
      <NotificationsSidebarItem pollingInterval={5000} />

      {/* Existing code for reference: */}
      <SidebarSpace />
      <SidebarSpace />
      <SidebarDivider />
      <SidebarDivider />
      <SidebarGroup
        <SidebarGroup label="Settings"
```

### Add to router

In the `packages/app/src/App.tsx`:

```
import { NOTIFICATIONS_ROUTE, NotificationsPage } from '@backstage/plugin-notifications-frontend';
...

export const AppBase = () => {
    ...
      {/* New code: */}
      <Route path={NOTIFICATIONS_ROUTE} element={<NotificationsPage />} />
```

## How to use the NotificationApi

```
import { notificationsApiRef, Notification } from '@backstage/plugin-notifications-frontend';

...

const notificationsApi = useApi(notificationsApiRef);
const notifications: Notification[] = await notificationsApi.getNotifications(params);

```

See `src/api/notificationsApi.ts` for more details.

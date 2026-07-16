# UnreadNotificationsCard

The `UnreadNotificationsCard` component displays a summarized list of the latest unread notifications on the RHDH Homepage Dashboard.

## Usage

### Dynamic homepage (RHDH)

Export the card from the notifications plugin and register it as a `home.page/cards` mount point:

```yaml
dynamicPlugins:
  frontend:
    backstage.backstage-plugin-notifications:
      mountPoints:
        - mountPoint: home.page/cards
          importName: UnreadNotificationsCard
          config:
            id: unread-notifications
            title: Last unread notifications
            layouts:
              xl: { w: 5, h: 8 }
              lg: { w: 5, h: 8 }
              md: { w: 12, h: 8 }
              sm: { w: 12, h: 11 }
              xs: { w: 12, h: 11 }
              xxs: { w: 12, h: 12 }
            props:
              maxMessages: 5
              charLimit: 80
```

### New Frontend System (alpha)

#### Option 1: Static NFS app (dev/testing)

Register the NFS home page widget by adding `notificationsHomeModule` to your app:

```tsx
import notificationsPlugin, {
  notificationsHomeModule,
} from '@backstage/plugin-notifications/alpha';
import homePlugin from '@backstage/plugin-home/alpha';

export default createApp({
  features: [
    notificationsPlugin,
    notificationsHomeModule,
    homePlugin,
    // ...other features
  ],
});
```

#### Option 2: RHDH `app-next` (dynamic module federation)

This mirrors the [quickstart NFS dynamic loading pattern](https://github.com/redhat-developer/rhdh-plugins/pull/3530): bundle the plugin as a module federation remote and let `dynamicFrontendFeaturesLoader()` load it at runtime.

**Step 1: Bundle the notifications plugin**

From the notifications plugin directory:

```bash
cd plugins/notifications
yarn build --role frontend-dynamic-container
cp -R $(pwd) /path/to/rhdh/dynamic-plugins-root/
```

> In newer Backstage CLI versions this is also available as
> `npx backstage-cli package bundle --output-destination <dynamic-plugins-root>`.

The bundle automatically exposes three entry points:

| Expose                      | Loads                                                                   |
| --------------------------- | ----------------------------------------------------------------------- |
| `.`                         | Legacy `PluginRoot` (`UnreadNotificationsCard`, `NotificationsPage`, …) |
| `alpha`                     | NFS `createFrontendPlugin` (notifications page + API)                   |
| `notifications-home-module` | `notificationsHomeModule` (home page widget)                            |

Verify in backend logs:

```text
/remotes => [{"packageName":"@backstage/plugin-notifications",
  "exposedModules":[".","alpha","notifications-home-module"]}]
```

**Step 2: Add infrastructure dependencies to `app-next`**

The widget attaches to the `home` plugin, which must be present in the app shell:

```json
"dependencies": {
  "@backstage/plugin-home": "<version>"
}
```

```tsx
import { createApp } from '@backstage/frontend-defaults';
import { dynamicFrontendFeaturesLoader } from '@backstage/frontend-dynamic-feature-loader';
import homePlugin from '@backstage/plugin-home/alpha';

const app = createApp({
  features: [
    homePlugin,
    dynamicFrontendFeaturesLoader(),
    // notifications plugin + home module are loaded dynamically
  ],
});
```

The notifications plugin itself is **not** added as a static dependency — it is loaded via module federation.

**Step 3: Configure `app-config.local.yaml`**

```yaml
app:
  extensions:
    - home-page-widget:home/unread-notifications: true
```

**Step 4: Build and start**

```bash
EXPERIMENTAL_MODULE_FEDERATION=true yarn workspace app-next build
APP_CONFIG_app_packageName=app-next ENABLE_STANDARD_MODULE_FEDERATION=true yarn workspace backend start:next
```

**Step 5: Verify**

Navigate to `http://localhost:7007/visualizer/tree` and confirm:

- `page:notifications/notifications` — notifications page
- `api:notifications/notifications` — notifications API
- `home-page-widget:home/unread-notifications` — unread notifications widget

Enable the widget on the home page grid (widget name: `UnreadNotifications`):

```yaml
app:
  extensions:
    - home-page-widget:home/unread-notifications: true
```

The legacy `UnreadNotificationsCard` export remains available for dynamic plugin
`home.page/cards` mount points (`module: Legacy`).

## Props

| Prop                  | Type     | Default | Description                                                                            |
| --------------------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| `maxMessages`         | `number` | `5`     | Maximum number of unread notifications to fetch and display                            |
| `charLimit`           | `number` | `80`    | Maximum number of plain-text characters shown per notification title before truncation |
| `descriptionMaxChars` | `number` | `120`   | Maximum plain-text characters for notification descriptions in the card                |

Deprecated aliases (still supported):

| Prop           | Maps to       |
| -------------- | ------------- |
| `initialCount` | `maxMessages` |
| `maxChars`     | `charLimit`   |

Notification titles are always rendered as plain text. Any markdown or HTML in the source title is stripped before display. Truncated titles expose the full plain-text title via the HTML `title` attribute for accessibility.

## Behavior

- Fetches only unread notifications from `NotificationsApi`
- Clicking a notification navigates to `/notifications?id=<notificationId>` so the target message is highlighted, expanded, and focused on the notifications page
- Shows a centered **All caught up!** empty state with a double-checkmark icon when there are no unread notifications
- Always shows a **View All** button in the card header linking to `/notifications`
- Refreshes when notification signals are received (`new_notification`, `notification_read`, `notification_unread`)
- Falls back to polling every 30 seconds when the signals API is unavailable (for example in module federation setups without shared signals)
- Refreshes when the user returns to the homepage tab (document visibility change)

## Route parameter support

See [route-params-investigation.md](./route-params-investigation.md) for the technical investigation of `/notifications?id=<notificationId>` deep-linking.

## Troubleshooting

Deep-linking from the card to a specific notification requires the Notifications plugin to be correctly installed and routed in your Backstage app:

1. Install `@backstage/plugin-notifications` and `@backstage/plugin-notifications-backend`
2. Register the notifications backend in `packages/backend`
3. Add a frontend route for `/notifications` that renders `NotificationsPage`
4. For real-time refresh, also install `@backstage/plugin-signals` and `@backstage/plugin-signals-backend`
5. Rebuild the plugin (`yarn build`) before running `export-dynamic-plugin`

If the `/notifications` route is missing or misconfigured, notification links and the **View All** button will not navigate to the expected page.

### Signals / live refresh not working

If the card loads notifications but does not auto-update when new messages arrive:

1. **Backend** — Ensure both `backstage-plugin-signals-backend-dynamic` and `backstage-plugin-notifications-backend-dynamic` are installed in `dynamic-plugins-root` and that `events-backend` is running.
2. **Frontend signals plugin** — For NFS `app-next`, add `signalsPlugin` from `@backstage/plugin-signals/alpha` to `App.tsx`. Place it **after** `dynamicFrontendFeaturesLoader()` so it wins over any duplicate signals MF remote.
3. **Remove duplicate signals MF remote** — If `dynamic-plugins-root/@backstage-plugin-signals` exists alongside the static `signalsPlugin`, remove the MF copy to avoid plugin deduplication conflicts.
4. **WebSocket** — In browser DevTools → Network, filter by `WS` and confirm a connection to the signals service opens when the home page loads.
5. **Polling fallback** — When signals are unavailable, the card polls every 30 seconds while the tab is visible.

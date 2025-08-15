# UptimeRobot Plugin

The UptimeRobot plugin provides a frontend interface to monitor your UptimeRobot monitors directly within Backstage.

## Features

- Display UptimeRobot monitors in a table format
- Real-time status indicators (Up, Down, Paused/Pending)
- Monitor type mapping (HTTP(s), Keyword, Ping, Port, Heartbeat)
- Searchable and paginated table
- Integration with Backstage theming

## Installation

### Backend Plugin

1. Install the backend plugin package:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @internal/plugin-uptimerobot-backend
```

2. Add the plugin to your backend in `packages/backend/src/index.ts`:

```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins

backend.add(import('@internal/plugin-uptimerobot-backend'));

backend.start();
```

### Frontend Plugin

1. Install the frontend plugin package:

```bash
# From your Backstage root directory
yarn --cwd packages/app add @internal/plugin-uptimerobot
```

2. Add the plugin page to your app routes in `packages/app/src/App.tsx`:

```typescript
import { UptimeRobotPage } from '@internal/plugin-uptimerobot';

// In your App component
const routes = (
  <FlatRoutes>
    {/* ... other routes */}
    <Route path="/uptimerobot" element={<UptimeRobotPage />} />
  </FlatRoutes>
);
```

3. Add a link to the plugin in your sidebar in `packages/app/src/components/Root/Root.tsx`:

```typescript
import MonitorIcon from '@material-ui/icons/Monitor';

// In your sidebar
<SidebarItem icon={MonitorIcon} to="uptimerobot" text="UptimeRobot" />
```

## Configuration

### API Key Configuration

Add your UptimeRobot API key to your `app-config.yaml`:

```yaml
uptimerobot:
  apiKey: ${UPTIMEROBOT_API_KEY}
```

Set the environment variable:

```bash
export UPTIMEROBOT_API_KEY="your-uptimerobot-api-key"
```

### Proxy Configuration

Add the proxy configuration to your `app-config.yaml`:

```yaml
proxy:
  endpoints:
    '/uptimerobot':
      target: '${BACKEND_URL}/api/uptimerobot'
      changeOrigin: true
```

## Getting Your UptimeRobot API Key

1. Log in to your UptimeRobot account
2. Go to "My Settings" → "API Settings"
3. Create a new API key with "Read-Only" access
4. Copy the generated API key

## Status Codes

The plugin maps UptimeRobot status codes to visual indicators:

- **2**: Up (Green)
- **8, 9**: Down (Red)
- **0, 1**: Paused/Pending (Yellow)

## Monitor Types

The plugin supports the following UptimeRobot monitor types:

- **1**: HTTP(s)
- **2**: Keyword
- **3**: Ping
- **4**: Port
- **5**: Heartbeat

## Development

To start the plugin in development mode:

```bash
yarn start
```

To run tests:

```bash
yarn test
```

To build the plugin:

```bash
yarn build
```

## Contributing

When contributing to this plugin, please ensure all changes are properly tested and documented.
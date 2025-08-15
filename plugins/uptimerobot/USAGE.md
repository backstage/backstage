# UptimeRobot Plugin Usage Guide

This guide provides detailed instructions on how to use the UptimeRobot plugin in Backstage.

## Prerequisites

- UptimeRobot account with monitors configured
- UptimeRobot API key (Read-Only access recommended)
- Backstage instance with the UptimeRobot plugin installed

## Step-by-Step Setup

### 1. Obtain UptimeRobot API Key

1. Visit [UptimeRobot](https://uptimerobot.com) and log into your account
2. Navigate to "My Settings" → "API Settings"
3. Click "Create API Key"
4. Select "Read-Only API Key" for security
5. Copy the generated API key

### 2. Configure Environment Variables

Set your API key as an environment variable:

```bash
# In your .env file or environment
export UPTIMEROBOT_API_KEY="ur1234567-abcd1234efgh5678ijkl90mnopqr"
```

### 3. Update app-config.yaml

Add the UptimeRobot configuration:

```yaml
# UptimeRobot plugin configuration
uptimerobot:
  apiKey: ${UPTIMEROBOT_API_KEY}

# Proxy configuration for frontend
proxy:
  endpoints:
    '/uptimerobot':
      target: '${BACKEND_URL}/api/uptimerobot'
      changeOrigin: true
      headers:
        # Optional: Add custom headers if needed
        X-Forwarded-Proto: https
```

### 4. Complete App Integration Example

#### packages/app/src/App.tsx
```typescript
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { UptimeRobotPage } from '@internal/plugin-uptimerobot';
import { FlatRoutes } from '@backstage/core-app-api';
// ... other imports

const routes = (
  <FlatRoutes>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    />
    <Route path="/docs" element={<ApiExplorerPage />} />
    <Route path="/uptimerobot" element={<UptimeRobotPage />} />
    <Route path="/" element={<Navigate to="catalog" />} />
  </FlatRoutes>
);

const App = () => (
  <AppRouter>
    <Root>{routes}</Root>
  </AppRouter>
);

export default App;
```

#### packages/app/src/components/Root/Root.tsx
```typescript
import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import { Sidebar, sidebarConfig, SidebarPage } from '@backstage/core-components';
import { NavLink } from 'react-router-dom';
import { Settings as SettingsIcon } from '@material-ui/icons';
import { MonitorHeartIcon } from '@material-ui/icons/MonitorHeart';
// ... other imports

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="catalog" text="Home" />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={MonitorHeartIcon} to="uptimerobot" text="UptimeRobot" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        // ... other items
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
```

#### packages/backend/src/index.ts
```typescript
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// System plugins
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));

// Auth plugin
backend.add(import('@backstage/plugin-auth-backend'));

// Catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));

// UptimeRobot plugin
backend.add(import('@internal/plugin-uptimerobot-backend'));

// ... other plugins

backend.start();
```

## Using the Plugin

### Accessing UptimeRobot Data

1. Start your Backstage application:
   ```bash
   yarn dev
   ```

2. Navigate to `http://localhost:3000/uptimerobot`

3. You should see a table displaying your UptimeRobot monitors with:
   - Monitor names
   - URLs being monitored
   - Monitor types (HTTP(s), Ping, etc.)
   - Current status (Up, Down, Paused/Pending)
   - Check intervals

### Understanding Status Indicators

- **Green (Up)**: Monitor is operational and responding correctly
- **Red (Down)**: Monitor has detected an issue or is unreachable  
- **Yellow (Paused/Pending)**: Monitor is paused or in a pending state

### Table Features

- **Search**: Use the search box to filter monitors by name or URL
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large numbers of monitors

## Troubleshooting

### Common Issues

1. **"UptimeRobot API key not configured" error**
   - Ensure `UPTIMEROBOT_API_KEY` environment variable is set
   - Verify the API key in your `app-config.yaml` configuration

2. **"Failed to fetch monitors" error**
   - Check your internet connection
   - Verify your UptimeRobot API key is valid and has appropriate permissions
   - Check the Backstage backend logs for detailed error information

3. **Plugin page not loading**
   - Ensure both frontend and backend plugins are properly installed
   - Check that the route is correctly configured in `App.tsx`
   - Verify the proxy configuration in `app-config.yaml`

### Checking Backend Health

You can verify the backend plugin is working by accessing:
```
http://localhost:7007/api/uptimerobot/health
```

This should return:
```json
{
  "status": "ok"
}
```

### API Testing

Test the monitors endpoint directly:
```bash
curl http://localhost:7007/api/uptimerobot/monitors
```

## Security Considerations

- Store API keys securely using environment variables
- Use Read-Only API keys when possible
- Regularly rotate API keys
- Monitor access logs for unusual activity

## Advanced Configuration

### Custom Proxy Headers

```yaml
proxy:
  endpoints:
    '/uptimerobot':
      target: '${BACKEND_URL}/api/uptimerobot'
      changeOrigin: true
      headers:
        X-Custom-Header: 'value'
        User-Agent: 'Backstage-UptimeRobot-Plugin'
```

### Rate Limiting

UptimeRobot has API rate limits. The plugin automatically handles basic rate limiting scenarios, but for high-traffic installations, consider implementing caching.

### Multiple UptimeRobot Accounts

Currently, the plugin supports one UptimeRobot account per Backstage instance. For multiple accounts, you would need to deploy separate Backstage instances or extend the plugin.
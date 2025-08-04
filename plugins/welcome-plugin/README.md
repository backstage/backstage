# Welcome Plugin

A simple Backstage plugin that displays a welcome page.

## Overview

This plugin provides a basic welcome page that demonstrates the fundamental structure of a Backstage frontend plugin. It showcases:

- Basic plugin setup and configuration
- Integration with Backstage's core components
- Material-UI components for consistent styling
- Routing and navigation

## Features

- Welcome page with informational content
- Clean Material-UI based interface
- Integration with Backstage's theming system
- Responsive grid layout

## Installation

This plugin is part of the Backstage monorepo and follows the standard plugin structure.

## Usage

The welcome plugin can be integrated into a Backstage app by importing and using the `WelcomePage` component in your app's routing configuration.

```typescript
import { WelcomePage } from '@internal/plugin-welcome';

// In your app's routing configuration (typically in packages/app/src/App.tsx)
<Route path="/welcome" element={<WelcomePage />} />
```

Or you can use the plugin directly in your App.tsx:

```typescript
import { welcomePlugin, WelcomePage } from '@internal/plugin-welcome';

// Register the plugin
const app = createApp({
  plugins: [welcomePlugin],
  // ... other configuration
});

// Use the page component
<Route path="/welcome" element={<WelcomePage />} />
```

## Development

To work on this plugin:

1. Install dependencies: `yarn install`
2. Start development server: `yarn start`
3. Run tests: `yarn test`
4. Build the plugin: `yarn build`
5. Lint the code: `yarn lint`

## Structure

```
src/
├── components/
│   └── WelcomePage/
│       ├── WelcomePage.tsx  # Main component
│       └── index.ts         # Component exports
├── index.ts                 # Plugin exports
├── plugin.ts                # Plugin definition
└── routes.ts                # Route definitions
```

## License

Licensed under the Apache License, Version 2.0.
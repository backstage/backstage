# Tasks Plugin

This plugin provides a comprehensive task management system for Backstage, including both a UI for viewing and managing tasks, and a library of hooks for other plugins to integrate with the task system.

## Features

- View all tasks across plugins
- Filter tasks by plugin
- Trigger task execution
- Monitor task status and execution history
- Library hooks for integration with other plugins

## Installation

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-tasks
```

## Setup

### Frontend Plugin

Add the plugin to your frontend app in `packages/app/src/App.tsx`:

```tsx
import { TasksPage } from '@backstage/plugin-tasks';

const routes = (
  <FlatRoutes>
    {/* other routes */}
    <Route path="/tasks" element={<TasksPage />} />
  </FlatRoutes>
);
```

### Backend Plugin

Add the backend plugin to your backend in `packages/backend/src/index.ts`:

```tsx
import { tasksPlugin } from '@backstage/plugin-tasks-backend';

const backend = createBackend();
backend.add(tasksPlugin);
```

## Development

```bash
# Start the plugin in development mode
yarn start

# Run tests
yarn test

# Lint
yarn lint
```

## Roadmap

- Support i18n system
- Support new frontend system
- Review audit
- Review permissions

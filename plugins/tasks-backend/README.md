# Tasks Backend Plugin

The Tasks Backend plugin provides a service for managing and executing scheduled tasks in Backstage. It integrates with Backstage's scheduler service and provides a REST API for task management.

## Features

- Task metadata management
- Task execution through Backstage's scheduler
- REST API for task operations
- Integration with Backstage's permission framework
- Plugin discovery and validation

## Installation

1. Add the plugin to your Backstage app:

```bash
yarn add @backstage/plugin-tasks-backend
```

2. Add the plugin to your app's dependencies in `packages/app/package.json`:

```json
{
  "dependencies": {
    "@backstage/plugin-tasks-backend": "^0.1.0"
  }
}
```

3. Add the plugin to your backend in `packages/backend/src/index.ts`:

```tsx
import tasks from './plugins/tasks';

// In your backend configuration
backend.add(tasks);
```

## Configuration

Configure tasks in your `app-config.yaml`:

```yaml
tasks:
  # Optional: Enable/disable plugins that can have tasks
  enabledPlugins: ['plugin1', 'plugin2']

  # Task metadata overrides
  metadata:
    my-plugin:
      title: 'My Plugin Title'
      description: 'Plugin description'
      tasks:
        - name: 'my-task'
          title: 'My Task'
          description: 'Description of what this task does'
```

The plugin will automatically validate that the target plugin exists using Backstage's discovery service.

## API Endpoints

The plugin provides the following REST endpoints:

- `GET /api/tasks` - List all available tasks
- `GET /api/tasks/:id` - Get details for a specific task
- `POST /api/tasks/:id/trigger` - Trigger a task execution

### Example Usage

```bash
# List all tasks
curl http://localhost:7007/api/tasks

# Get task details
curl http://localhost:7007/api/tasks/my-task

# Trigger a task
curl -X POST http://localhost:7007/api/tasks/my-task/trigger
```

## Permissions

The plugin uses Backstage's permission framework with a two-level permission system:

### Permission Types

1. **`task.list`** (Basic Permission) - Prerequisite to access the tasks list endpoint
2. **`task.read`** (Resource Permission) - Required to view individual tasks
3. **`task.trigger`** (Resource Permission) - Required to trigger individual tasks

### Permission Behavior

- **List Tasks**: Requires `task.list` permission first, then filters tasks based on `task.read` permissions
- **Users with list permission but no read permissions**: Will receive an empty list instead of an error
- **Individual task operations**: Require the appropriate resource-level permission (`task.read` or `task.trigger`)

To configure permissions, add the following to your `app-config.yaml`:

```yaml
permission:
  enabled: true
  permissionedPlugins:
    - tasks
```

Example RBAC policy:

```yaml
permission:
  rbac:
    defaultPolicy:
      # Basic permission to list tasks
      - permission: task.list
        effect: allow
        role: default/developer

      # Resource permission to read individual tasks
      - permission: task.read
        effect: allow
        role: default/developer

      # Resource permission to trigger tasks
      - permission: task.trigger
        effect: allow
        role: default/admin
```

## Integration with Other Plugins

The Tasks Backend plugin integrates with:

1. **Scheduler Service**: For task execution
2. **Discovery Service**: For plugin validation and communication
3. **Permission Framework**: For access control
4. **HTTP Router**: For REST API endpoints

## Development

### Building

```bash
yarn build
```

### Testing

```bash
yarn test
```

### Linting

```bash
yarn lint
```

## Troubleshooting

### Common Issues

1. **Task not found**: Ensure the task is properly configured in `app-config.yaml` and the target plugin exists
2. **Permission denied**: Check your RBAC configuration and ensure the user has the required permissions
3. **Task execution failed**: Check the backend logs for detailed error messages

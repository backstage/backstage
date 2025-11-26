# Scaffolder Backend

This is the backend for the default Backstage [software templates](https://backstage.io/docs/features/software-templates/).
This provides the API for the frontend [scaffolder plugin](https://github.com/backstage/backstage/tree/master/plugins/scaffolder),
as well as the built-in template actions, tasks and stages.

## Installation

This `@backstage/plugin-scaffolder-backend` package comes installed by default
in any Backstage application created with `npx @backstage/create-app`, so
installation is not usually required.

To check if you already have the package, look under
`packages/backend/package.json`, in the `dependencies` block, for
`@backstage/plugin-scaffolder-backend`. The instructions below walk through
restoring the plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend
```

Then add the plugin to your backend, typically in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-scaffolder-backend'));
```

#### Old backend system

In the old backend system there's a bit more wiring required. You'll need to
create a file called `packages/backend/src/plugins/scaffolder.ts`
with contents matching [scaffolder.ts in the create-app template](https://github.com/backstage/backstage/blob/ad9314d3a7e0405719ba93badf96e97adde8ef83/packages/create-app/templates/default-app/packages/backend/src/plugins/scaffolder.ts).

With the `scaffolder.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import scaffolder from './plugins/scaffolder';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));

  const apiRouter = Router();
+  apiRouter.use('/scaffolder', await scaffolder(scaffolderEnv));
  ...
  apiRouter.use(notFoundHandler());

```

### Adding templates

At this point the scaffolder backend is installed in your backend package, but
you will not have any templates available to use. These need to be [added to the software catalog](https://backstage.io/docs/features/software-templates/adding-templates).

To get up and running and try out some templates quickly, you can or copy the
catalog locations from the [create-app template](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/app-config.yaml.hbs).

## Configuration

### Default Environment

The scaffolder supports a `defaultEnvironment` configuration that provides default parameters and secrets to all templates. This reduces template complexity and improves security by centralizing common values.

```yaml
scaffolder:
  defaultEnvironment:
    parameters:
      region: eu-west-1
      organizationName: acme-corp
      defaultRegistry: registry.acme-corp.com
    secrets:
      AWS_ACCESS_KEY: ${AWS_ACCESS_KEY}
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      DOCKER_REGISTRY_TOKEN: ${DOCKER_REGISTRY_TOKEN}
```

#### Default parameters

Default parameters are accessible via `${{ environment.parameters.* }}` in templates. Default parameters are isolated in their own context to avoid naming conflicts.

```yaml
 parameters:
    - title: Fill in some steps
      required:
        - organizationName
      properties:
        organizationName:
          title: organizationName
          type: string
          description: Unique name of the organization
          ui:autofocus: true
          ui:options:
            rows: 5

  steps:
    - id: deploy
      name: Deploy Application
      action: aws:deploy
      input:
        region: ${{ environment.parameters.region }}  # Resolves to defaultEnvironment.parameters.region
        organization: ${{ parameters.organizationName }}  # Resolves to frontend input value
        otherOrganization: ${{ environment.parameters.organizationName }}  # Resolves to defaultEnvironment.parameters.organizationName
```

#### Secrets

Default secrets are resolved from environment variables and accessible via `${{ environment.secrets.* }}` in template actions. Secrets are only available during action execution, not in frontend forms.

```yaml
- id: deploy
  name: Deploy with credentials
  action: aws:deploy
  input:
    accessKey: ${{ environment.secrets.AWS_ACCESS_KEY }} # Resolves to defaultEnvironment.secrets.AWS_ACCESS_KEY
```

**Security Note:** Secrets are automatically masked in logs and are only available to backend actions, never exposed to the frontend.

## Audit Events

The Scaffolder backend emits audit events for various operations. Events are grouped logically by `eventId`, with `subEventId` providing further distinction when needed.

**Template Events:**

- **`template-parameter-schema`**: Retrieves template parameter schemas. (GET `/v2/templates/:namespace/:kind/:name/parameter-schema`)

**Action Events:**

- **`action-fetch`**: Retrieves installed actions. (GET `/v2/actions`)

**Task Events:**

- **`task`**: Operations related to Scaffolder tasks.

  Filter on `actionType`.

  - **`create`**: Creates a new task. (POST `/v2/tasks`)
  - **`list`**: Fetches details of all tasks. (GET `/v2/tasks`)
  - **`get`**: Fetches details of a specific task. (GET `/v2/tasks/:taskId`)
  - **`cancel`**: Cancels a running task. (POST `/v2/tasks/:taskId/cancel`)
  - **`retry`**: Retries a failed task. (POST `/v2/tasks/:taskId/retry`)
  - **`stream`**: Retrieves a stream of task logs. (GET `/v2/tasks/:taskId/eventstream`)
  - **`events`**: Retrieves a snapshot of task logs. (GET `/v2/tasks/:taskId/events`)
  - **`dry-run`**: Creates a dry-run task. (POST `/v2/dry-run`) All audit logs for events associated with dry runs have the `meta.isDryLog` flag set to `true`.
  - **`stale-cancel`**: Automated cancellation of stale tasks.
  - **`execute`**: Tracks the initiation and completion of a real scaffolder task execution. This event will not occur during dry runs.

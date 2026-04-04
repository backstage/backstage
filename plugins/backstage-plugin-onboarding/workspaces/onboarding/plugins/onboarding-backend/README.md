# @estehsaan/backstage-plugin-onboarding-backend

Backend for the Backstage onboarding checklist plugin. Provides API endpoints for managing onboarding progress, team stats, and template assignment.

## Installation

```bash
yarn --cwd packages/backend add @estehsaan/backstage-plugin-onboarding-backend
```

Add the backend plugin and the catalog module to `packages/backend/src/index.ts`:

```ts
// Core backend plugin (REST API + database)
backend.add(import('@estehsaan/backstage-plugin-onboarding-backend'));

// Catalog module — registers the OnboardingTemplate entity kind processor.
// Required if you want to define OnboardingTemplate entities in the catalog.
backend.add(import('@estehsaan/backstage-plugin-onboarding-backend/alpha'));
```

> **Note**: The catalog module is exported from the `/alpha` path. It registers `OnboardingTemplateProcessor` with the catalog's processing extension point, enabling the `kind: OnboardingTemplate` entity kind. Without it, catalog YAML files with `kind: OnboardingTemplate` will be rejected.

## API Endpoints

| Method | Path                                                     | Description                    |
| ------ | -------------------------------------------------------- | ------------------------------ |
| GET    | `/api/onboarding/health`                                 | Health check                   |
| GET    | `/api/onboarding/progress/:userId`                       | Get user's onboarding progress |
| POST   | `/api/onboarding/progress/:userId/tasks/:taskId`         | Update a task status           |
| GET    | `/api/onboarding/team/:teamName/stats`                   | Get team onboarding stats      |
| GET    | `/api/onboarding/templates`                              | List all onboarding templates  |
| POST   | `/api/onboarding/templates/:templateName/assign/:userId` | Assign a template to a user    |

## License

Apache-2.0

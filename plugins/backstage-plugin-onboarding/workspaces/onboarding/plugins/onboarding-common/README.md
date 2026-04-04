# @estehsaan/backstage-plugin-onboarding-common

Shared types, constants, and permission definitions for the Backstage onboarding plugin suite.

This package is a dependency of both the frontend (`@estehsaan/backstage-plugin-onboarding`) and the backend (`@estehsaan/backstage-plugin-onboarding-backend`). Install it directly only if you are building an extension of those packages (e.g. a custom frontend component or a backend module for the onboarding plugin).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @estehsaan/backstage-plugin-onboarding-common
# or for frontend packages
yarn --cwd packages/app add @estehsaan/backstage-plugin-onboarding-common
```

## Exported Types

| Type                  | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `TaskStatus`          | `'pending' \| 'in-progress' \| 'done' \| 'blocked'`                    |
| `TaskType`            | `'manual' \| 'automated'`                                              |
| `Phase`               | `'day1' \| 'week1' \| 'week2' \| 'month1'`                             |
| `ResourceType`        | `'video' \| 'doc' \| 'article' \| 'course' \| 'repo' \| 'tool'`        |
| `TaskResource`        | A link or resource attached to a task                                  |
| `OnboardingTask`      | A single checklist task inside a template phase                        |
| `OnboardingTemplate`  | A full onboarding template catalog entity (`kind: OnboardingTemplate`) |
| `OnboardingProgress`  | The persisted progress state for a specific user                       |
| `TeamOnboardingStats` | Aggregated stats for a team (used by the manager view)                 |

## Exported Permissions

| Constant                             | Permission name                     | Action   |
| ------------------------------------ | ----------------------------------- | -------- |
| `onboardingProgressReadPermission`   | `onboarding.progress.read`          | `read`   |
| `onboardingProgressUpdatePermission` | `onboarding.progress.update`        | `update` |
| `onboardingTeamReadPermission`       | `onboarding.team.read`              | `read`   |
| `onboardingTemplateAssignPermission` | `onboarding.template.assign`        | `create` |
| `onboardingPermissions`              | Array of all four permissions above | —        |

All permissions are defined with `createPermission` from `@backstage/plugin-permission-common` and can be referenced in a custom Backstage permission policy.

## License

Apache-2.0

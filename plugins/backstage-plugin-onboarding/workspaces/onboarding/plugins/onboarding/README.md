# @estehsaan/backstage-plugin-onboarding

A structured, interactive onboarding checklist plugin for [Backstage](https://backstage.io) that guides new engineers through their first Day 1, Week 1, Week 2, and Month 1.

It replaces static Confluence/Notion docs with a live, trackable, automated checklist that both the new joiner and their manager/team lead can see.

<!-- TODO: Add a screenshot of the onboarding dashboard and replace this comment -->

## Features

- **Phase-based task lists** — Tasks organized into Day 1, Week 1, Week 2, and Month 1 phases
- **Progress tracking** — Real-time progress bar and per-phase completion stats
- **Dependency locking** — Tasks with prerequisites are locked until dependencies are done
- **Automated tasks** — Integration with the Backstage scaffolder for automated provisioning
- **Team view** — Managers can see onboarding progress for all team members
- **Template system** — Configurable onboarding templates per role and team
- **Blocked task tracking** — Tasks can be marked as blocked with a reason

## Installation

### Frontend

```bash
# From your Backstage root directory
yarn --cwd packages/app add @estehsaan/backstage-plugin-onboarding
```

Add the plugin page to your app routes in `packages/app/src/App.tsx`:

```tsx
import { OnboardingPage } from '@estehsaan/backstage-plugin-onboarding';

// In your routes:
<Route path="/onboarding" element={<OnboardingPage />} />
```

Add a sidebar item in `packages/app/src/components/Root/Root.tsx`:

```tsx
import SchoolIcon from '@material-ui/icons/School';

// In your sidebar:
<SidebarItem icon={SchoolIcon} to="onboarding" text="Onboarding" />
```

### Backend

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @estehsaan/backstage-plugin-onboarding-backend
```

Add the backend plugin to `packages/backend/src/index.ts`:

```ts
backend.add(import('@estehsaan/backstage-plugin-onboarding-backend'));
```

## Configuration

Add the following to your `app-config.yaml`:

```yaml
onboarding:
  templates:
    - type: catalog        # Load from Backstage catalog entities
  defaults:
    activeJoinerWindowDays: 90    # How many days to consider someone "new"
    buddy:
      autoAssign: true            # Auto-assign buddy from team members
```

## Onboarding Templates

Templates are defined as YAML files and registered in the Backstage catalog as `OnboardingTemplate` kind entities.

Example template:

```yaml
apiVersion: onboarding.backstage.io/v1
kind: OnboardingTemplate
metadata:
  name: backend-engineer-platform
  title: Backend Engineer — Platform Team
  description: Standard onboarding for backend engineers joining the platform team
spec:
  role: backend-engineer
  team: platform
  phases:
    - id: day1
      tasks:
        - id: setup-laptop
          title: Set up laptop & dev environment
          description: Run the bootstrap script and verify your local stack starts correctly.
          type: automated
          automationRef: setup-dev-environment
          assignee: self
          duePhase: day1
          link:
            label: Open setup guide
            url: https://docs.internal/setup

        - id: meet-buddy
          title: Meet your onboarding buddy
          description: 30-min intro call with your assigned buddy.
          type: manual
          assignee: buddy
          duePhase: day1

    - id: week1
      tasks:
        - id: security-training
          title: Complete security & compliance training
          description: Required before production access. Takes ~45 minutes.
          type: manual
          assignee: self
          duePhase: week1
          link:
            label: Start training
            url: https://training.internal/security

        - id: oncall-shadow
          title: Shadow an on-call shift
          description: Join the current on-call engineer for one shift.
          type: manual
          assignee: buddy
          dependsOn: [security-training]
          duePhase: week1

    - id: week2
      tasks:
        - id: first-pr
          title: Submit your first pull request
          description: Pick any "good first issue" from the team backlog.
          type: manual
          assignee: self
          duePhase: week2

    - id: month1
      tasks:
        - id: 30-day-checkin
          title: Complete 30-day check-in with manager
          description: Structured conversation covering experience, feedback, and 90-day goals.
          type: manual
          assignee: manager
          duePhase: month1
```

## Task Types

| Type | Description |
|------|-------------|
| `manual` | Requires human action — click the checkbox when complete |
| `automated` | Triggers a Backstage scaffolder action via `automationRef` |

## Task Statuses

| Status | Description |
|--------|-------------|
| `pending` | Not yet started |
| `in-progress` | Automated task is currently running |
| `done` | Completed |
| `blocked` | Cannot proceed — includes a reason |

## Permissions

| Action | Who can do it |
|--------|--------------|
| Read/update own progress | Any authenticated user |
| View team stats | Team leads (owners of the team entity) |
| Assign templates | Backstage admins |

## Development

```bash
cd workspaces/onboarding
yarn install
yarn start
```

## License

Apache-2.0

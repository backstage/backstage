---
'@backstage/plugin-azure-devops': patch
'@backstage/plugin-azure-devops-backend': patch
'@backstage/plugin-azure-devops-common': patch
---

Created some initial filters that can be used to create pull request columns:

- All
- AssignedToUser
- AssignedToCurrentUser
- AssignedToTeam
- AssignedToTeams
- AssignedToCurrentUsersTeams
- CreatedByUser
- CreatedByCurrentUser
- CreatedByTeam
- CreatedByTeams
- CreatedByCurrentUsersTeams

Example custom column creation:

```tsx
const COLUMN_CONFIGS: PullRequestColumnConfig[] = [
  {
    title: 'Created by me',
    filters: [{ type: FilterType.CreatedByCurrentUser }],
  },
  {
    title: 'Created by Backstage Core',
    filters: [
      {
        type: FilterType.CreatedByTeam,
        teamName: 'Backstage Core',
      },
    ],
  },
  {
    title: 'Assigned to my teams',
    filters: [{ type: FilterType.AssignedToCurrentUsersTeams }],
  },
  {
    title: 'Other PRs',
    filters: [{ type: FilterType.All }],
    simplified: true,
  },
];

<Route
  path="/azure-pull-requests"
  element={
    <AzurePullRequestsPage
      projectName="{PROJECT_NAME}"
      defaultColumnConfigs={COLUMN_CONFIGS}
    />
  }
/>;
```

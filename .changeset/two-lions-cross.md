---
'@backstage/plugin-azure-devops': patch
'@backstage/plugin-azure-devops-backend': patch
---

**Backend**

- Created new `/dashboard-pull-requests/:projectName` endpoint
- Created new `/all-teams` endpoint
- Implemented pull request policy evaluation conversion

**Frontend**

- Refactored `PullRequestsPage` and added new properties for `projectName` and `pollingInterval`
- Fixed spacing issue between repo link and creation date in `PullRequestCard`
- Added missing condition to `PullRequestCardPolicy` for `RequiredReviewers`
- Updated `useDashboardPullRequests` hook to implement long polling for pull requests

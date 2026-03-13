---
status: complete
priority: p3
issue_id: '011'
tags: [code-review, agent-native, feature]
dependencies: ['007']
---

# 011 — Only one Jira action exists — agents cannot perform common Jira workflows

## Problem Statement

The `atlassian-actions-backend` registers only `atlassian:jira:getIssue`. The token infrastructure, Atlassian OAuth scopes, and action framework support much more. An agent that fetches a Jira issue has no way to act on it:

- Cannot search for issues (JQL)
- Cannot add comments
- Cannot transition issue status
- Cannot create issues
- Cannot list issues assigned to the user

Meanwhile, GitHub and Microsoft tokens are being captured at sign-in time but have zero corresponding actions — those tokens are currently unused overhead.

**Most impactful additions for agentic workflows:**

1. `atlassian:jira:searchIssues` (JQL search) — enables agents to find relevant issues
2. `atlassian:jira:addComment` — enables agents to document their findings in issues
3. `atlassian:jira:transitionIssue` — enables agents to close/progress issues they've resolved

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts`**: Only `atlassian:jira:getIssue` registered
- **`packages/backend/src/index.ts`**: GitHub and Microsoft refresher modules registered but no corresponding action plugins
- Agent-native-reviewer found: "1 of ~6 meaningful Jira capabilities are agent-accessible"

## Proposed Solutions

### Phase 1 — Search + Comment (Highest ROI)

Add two new actions to `atlassian-actions-backend`:

- `atlassian:jira:searchIssues` — POST to `/rest/api/3/issue/picker` or GET `/rest/api/3/search` with JQL
- `atlassian:jira:addComment` — POST to `/rest/api/3/issue/{issueKey}/comment`

Both follow the same pattern as `getIssue`: validate credentials, get token, call Atlassian API.

### Phase 2 — Write actions

- `atlassian:jira:transitionIssue`
- `atlassian:jira:createIssue`

### Phase 3 — GitHub + Microsoft

Once Jira actions are complete, create:

- `github-actions-backend` plugin using captured GitHub tokens
- `microsoft-actions-backend` plugin using captured Microsoft tokens

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/atlassian-actions-backend/src/plugin.ts` (new action registrations)
- **New packages potentially**: `github-actions-backend`, `microsoft-actions-backend`

## Acceptance Criteria

- [ ] At minimum: `atlassian:jira:searchIssues` and `atlassian:jira:addComment` registered
- [ ] Each new action has the same security posture as `getIssue`: no userEntityRef in errors, token deletion on 401, URL input encoding
- [ ] Tests cover happy path and 401 stale-token scenario for each new action

## Work Log

- **2026-03-12**: Identified by agent-native-reviewer in /ce:review as the single biggest agent-native capability gap.

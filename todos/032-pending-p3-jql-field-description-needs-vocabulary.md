---
status: completed
priority: p3
issue_id: '032'
tags: [code-review, agent-native, dx]
dependencies: []
---

# 032 — JQL field description lacks vocabulary guidance — agents hallucinate invalid syntax

## Problem Statement

The `jql` field on `atlassian:jira:searchIssues` has a minimal description:

```typescript
jql: z.string().describe(
  'JQL query string, e.g. "project = MYPROJ AND status = Open"',
),
```

JQL (Jira Query Language) has non-obvious syntax that agents commonly get wrong:

- `assignee = me` is invalid; the correct form is `assignee = currentUser()`
- Status names are case-sensitive and must match exactly (`"In Progress"` not `"in progress"`)
- Project keys are uppercase (`PROJECT` not `project`)
- String values with spaces must be quoted (`status = "In Progress"`)
- `ORDER BY` must come at the end (`... ORDER BY updated DESC`)
- Relative dates use functions: `created >= -1w` or `created > startOfWeek()`

Without vocabulary guidance, an agent asked "find my open bugs assigned to me" will commonly
generate invalid JQL on the first attempt, causing a 400 error (which is also currently
swallowed — see todo #023), leading to a failed round-trip.

The example `"project = MYPROJ AND status = Open"` uses a hardcoded project key with no meaning
to agents and doesn't demonstrate the most common use cases.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 173-176**: Minimal JQL field description with unhelpful example

## Proposed Solution

Expand the `jql` field description with agent-oriented vocabulary:

```typescript
jql: z.string().max(2_000).describe(
  'JQL query string. Key syntax rules: ' +
  '(1) Use currentUser() for the calling user (e.g., assignee = currentUser()). ' +
  '(2) Status names are case-sensitive and quoted if they contain spaces (e.g., status = "In Progress"). ' +
  '(3) Project keys are uppercase (e.g., project = MYPROJECT). ' +
  '(4) ORDER BY goes at the end (e.g., ORDER BY updated DESC). ' +
  'Common examples: ' +
  '"assignee = currentUser() AND status != Done ORDER BY updated DESC" — my open issues; ' +
  '"project = MYPROJ AND issuetype = Bug AND status = Open" — open bugs in a project.',
),
```

This description is longer but dramatically reduces first-attempt 400 error rates for agents.
The extra token cost is trivial compared to a failed round-trip.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — expand `jql` field description

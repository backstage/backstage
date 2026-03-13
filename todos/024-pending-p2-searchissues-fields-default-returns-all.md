---
status: completed
priority: p2
issue_id: '024'
tags: [code-review, agent-native, performance]
dependencies: []
---

# 024 — `searchIssues` `fields` parameter: description says "standard set" but sends nothing — Jira returns all fields

## Problem Statement

The `fields` input parameter on `atlassian:jira:searchIssues` has this description:

```typescript
fields: z.array(z.string()).optional().describe(
  'Issue fields to include, e.g. ["summary","status","assignee"]. Defaults to a standard set.',
),
```

The implementation:

```typescript
const searchBody: Record<string, unknown> = {
  jql: input.jql,
  maxResults: input.maxResults,
  startAt: input.startAt,
};
if (input.fields) {
  searchBody.fields = input.fields;
}
```

When `input.fields` is not provided, no `fields` property is sent to the Jira API. Jira's
default behaviour when `fields` is omitted is to return **all fields** for each issue — which
can include ADF-formatted descriptions, comments, subtasks, watchers, worklogs, and custom
fields. At `maxResults=100` (the maximum), a single search call can return several megabytes
of data.

The description actively misleads agents and users: it says "defaults to a standard set" but
the actual default is the full Jira field set. An agent following the description will expect a
narrow response, but receives a large one.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 196-202**: Description says "standard set" but no default is implemented
- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 253-260**: `fields` is only added to body if truthy — no server-side default

## Proposed Solution

**Option A (recommended):** Set an explicit default `fields` list in the action handler that
matches the output schema's declared fields. When `input.fields` is absent, send this list
to Jira to prevent over-fetching:

```typescript
const defaultFields = [
  'summary',
  'status',
  'issuetype',
  'assignee',
  'priority',
];
searchBody.fields = input.fields ?? defaultFields;
```

Update the description to accurately reflect this:

```typescript
fields: z.array(z.string()).optional().describe(
  'Issue fields to include (default: summary, status, issuetype, assignee, priority). ' +
  'Add more fields like "labels", "description", or "comment" as needed.',
),
```

**Option B:** Keep the current pass-through behaviour but fix the description to be accurate:

```typescript
.describe('Issue fields to include. If omitted, Jira returns all fields (may be large).')
```

Option A is strongly preferred because it bounds response size by default, reduces context
window consumption for agents, and makes the action behave predictably at scale.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — set default fields list, update description

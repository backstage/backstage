---
status: completed
priority: p2
issue_id: '023'
tags: [code-review, agent-native, dx]
dependencies: []
---

# 023 — `searchIssues` swallows JQL error details — agents cannot self-correct bad queries

## Problem Statement

When `atlassian:jira:searchIssues` receives a 400 from Jira (which happens on invalid JQL
syntax, unknown field names, invalid operator usage, etc.), it throws a generic error:

```typescript
throw new Error(`Jira search API returned ${response.status}`);
```

The Jira REST API v3 `/search` endpoint returns a structured error body on 400 that contains
precisely what is wrong with the query:

```json
{
  "errorMessages": [],
  "warningMessages": [
    "Field 'statuss' does not exist or you do not have permission to view it."
  ],
  "total": 0,
  "issues": []
}
```

By discarding this body, the action prevents agents from understanding why a JQL query failed
and self-correcting. An agent receives `'Jira search API returned 400'` and has no information
to construct a corrected query, forcing it to either give up or ask the user for help.

JQL syntax errors are extremely common for agents constructing queries from natural language
(e.g., `assignee = me` instead of `assignee = currentUser()`, wrong field name casing,
missing quotes around values with spaces).

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 273-276**: Generic error thrown on non-401, non-200 responses from `searchIssues`

## Proposed Solution

Attempt to parse the Jira error body on 400 responses and include the structured messages in
the thrown error. JQL error messages from Jira are safe to surface (they describe the query,
not server internals):

```typescript
if (!response.ok) {
  if (response.status === 400) {
    // Attempt to extract Jira's structured error for agent self-correction
    const errorBody = await response.json().catch(() => null);
    const messages = [
      ...(errorBody?.errorMessages ?? []),
      ...(errorBody?.warningMessages ?? []),
    ].slice(0, 5); // limit to 5 messages

    const detail = messages.length > 0 ? `: ${messages.join('; ')}` : '';
    throw new Error(`Jira JQL query is invalid${detail}`);
  }
  throw new Error(`Jira search API returned ${response.status}`);
}
```

Additionally, improve the non-400 error to include a truncated JQL for correlation:

```typescript
throw new Error(
  `Jira search API returned ${response.status} for JQL: ${input.jql.substring(
    0,
    120,
  )}`,
);
```

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — improve error handling in `searchIssues` action
- `plugins/atlassian-actions-backend/src/plugin.test.ts` — add test case for 400 with Jira error body

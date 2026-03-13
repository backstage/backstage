---
status: completed
priority: p2
issue_id: '019'
tags: [code-review, security, reliability]
dependencies: []
---

# 019 — Jira action inputs have no maximum length constraints — memory amplification risk

## Problem Statement

Three input fields in the Jira actions have no upper-bound constraints:

1. `addComment.body`: `z.string().min(1)` — no `.max()`. A multi-megabyte body is ADF-wrapped and sent to Atlassian's API within the 15s timeout. At high concurrency, multiple large bodies cause significant heap pressure.

2. `searchIssues.jql`: `z.string()` — no length limit. The Jira REST API v3 enforces a ~2,000 character limit on JQL internally, but the action will transmit and allocate an arbitrarily large string before Jira rejects it with a 400.

3. `searchIssues.fields`: `z.array(z.string()).optional()` — no element count limit and no per-element length limit. An array of thousands of oversized strings is allocated and serialized into the POST body before any validation.

Individually, each input size is bounded by the actions framework's HTTP body size limit (if any), but there is no documented or enforced constraint in the action schema itself, making it an implicit assumption that is easy to violate.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` line 309**: `body: z.string().min(1)` — missing `.max()`
- **`plugins/atlassian-actions-backend/src/plugin.ts` line 171**: `jql: z.string()` — missing `.max()`
- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 193-202**: `fields: z.array(z.string()).optional()` — missing element count and per-element `.max()`

## Proposed Solution

Add maximum length constraints to all three fields:

```typescript
// addComment
body: z.string().min(1).max(32_768).describe('Plain-text comment body (max 32,768 characters)'),

// searchIssues
jql: z.string().max(2_000).describe('JQL query string (max 2,000 characters)'),
fields: z.array(z.string().max(100)).max(50).optional()
  .describe('Issue fields to include (max 50 fields)'),
```

The `body` limit of 32,768 aligns with Jira's ADF comment body size limit. The `jql` limit of
2,000 matches the Jira API's internal constraint. The `fields` limits of 50 items × 100 chars
each prevent array amplification while accommodating all legitimate Jira field identifiers.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — add `.max()` to `body`, `jql`, and `fields`
- `plugins/atlassian-actions-backend/src/plugin.test.ts` — add test cases verifying oversized inputs are rejected at the schema level

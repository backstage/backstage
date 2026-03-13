---
status: complete
priority: p2
issue_id: '007'
tags: [code-review, agent-native, typescript]
dependencies: []
---

# 007 — Jira `getIssue` output schema is `z.unknown()` — agents cannot reason about the response

## Problem Statement

The `atlassian:jira:getIssue` action returns `issue: z.unknown()`. This means:

1. AI agents have no schema contract for the response — they must guess field names
2. When `outputSchema` is eventually propagated in MCP `tools/list`, the tool description will offer no field guidance
3. Any downstream agent logic ("if status is In Progress, add comment") must either hallucinate the field path or probe `issue.status?.name` defensively

The Jira REST API v3 response has well-known fields: `summary`, `status.name`, `assignee.displayName`, `description.content`, `priority.name`, `issuetype.name`, `labels`, `comment.comments`.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 54-57**: `output: z => z.object({ issue: z.unknown() })`
- Agent-native-reviewer flagged this as P2: significantly reduces agent usability

## Proposed Solutions

### Option A — Typed partial schema with passthrough (Recommended)

```typescript
output: z =>
  z.object({
    issue: z.object({
      id: z.string(),
      key: z.string(),
      self: z.string().url(),
      fields: z.object({
        summary: z.string(),
        status: z.object({ name: z.string() }),
        assignee: z.object({ displayName: z.string() }).nullable(),
        priority: z.object({ name: z.string() }).nullable(),
        issuetype: z.object({ name: z.string() }),
        labels: z.array(z.string()),
        description: z.unknown().nullable(),
        comment: z.object({
          comments: z.array(z.object({
            body: z.unknown(),
            author: z.object({ displayName: z.string() }),
            created: z.string(),
          })).optional(),
        }).optional(),
      }).passthrough(),  // allow additional fields
    }),
  }),
```

- **Pros**: Agents know what fields to expect; types checked at the boundary
- **Effort**: Small-Medium
- **Risk**: Low (Jira API shape is stable; `.passthrough()` allows future fields)

### Option B — `z.record(z.unknown())` with description

```typescript
issue: z.record(z.unknown()).describe(
  'Jira issue object per Atlassian REST API v3. Key fields: id, key, fields.summary, fields.status.name, fields.assignee.displayName, fields.priority.name, fields.issuetype.name'
),
```

- **Pros**: Minimal change; description improves discoverability
- **Cons**: No runtime type enforcement; agents still need to know field paths
- **Effort**: Trivial
- **Risk**: Low

### Option C — Keep `z.unknown()`, add Zod description only

- **Pros**: Simplest
- **Cons**: Weakest agent guidance

## Recommended Action

_[To be filled during triage]_

## Technical Details

- **Affected files**: `plugins/atlassian-actions-backend/src/plugin.ts`

## Acceptance Criteria

- [ ] The `issue` output field has at minimum a `.describe()` pointing to key fields in the Jira REST API v3 response
- [ ] Ideally: a partial typed schema with `.passthrough()` covers the most commonly accessed fields
- [ ] No breaking change to callers (schema is only for validation/description)

## Work Log

- **2026-03-12**: Identified by agent-native-reviewer (P2) in /ce:review.

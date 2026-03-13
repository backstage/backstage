---
status: completed
priority: p3
issue_id: '030'
tags: [code-review, agent-native, dx]
dependencies: []
---

# 030 — `issueKey` regex rejects valid lowercase issue keys from natural language input

## Problem Statement

The `issueKey` input on `atlassian:jira:getIssue` and `atlassian:jira:addComment` is validated with:

```typescript
z.string().regex(/^[A-Z]+-\d+$/, 'issueKey must match PROJECT-123 format');
```

Jira project keys are uppercase by definition, so the regex is technically correct for
well-formed input. However, when agents or users supply issue keys from natural language
context (e.g., "fix proj-123" or a copy-paste from a document that lowercased the key),
the validation rejects the input with a Zod error rather than normalizing it.

Agents that receive `'issueKey must match PROJECT-123 format'` after constructing a key like
`'proj-42'` from user speech or markdown links cannot self-correct without re-asking the user
for the key in uppercase format — an unnecessary interruption.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 93-96**: `/^[A-Z]+-\d+$/` rejects lowercase
- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 304-307**: Same regex on `addComment.issueKey`

## Proposed Solution

Use `.transform()` to normalize the issue key to uppercase before validation, or use a
case-insensitive regex and normalize in the handler:

```typescript
issueKey: z.string()
  .transform(k => k.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]+-\d+$/, 'issueKey must match PROJECT-123 format')),
```

This accepts `proj-42`, `Proj-42`, or `PROJ-42` and normalizes them all to `PROJ-42` before
the regex check and the URL construction. The error message still guides users who supply
a completely malformed key (e.g., `issue42` with no hyphen).

Alternatively, update the description to be explicit about case:

```typescript
.describe('Issue key in PROJECT-123 format (uppercase project key). Example: MYPROJECT-42.')
```

Both changes are recommended — the `.transform()` for graceful agent handling, and the
updated description so agents know the expected format when constructing keys from scratch.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — add `.transform(k => k.toUpperCase())` to both `issueKey` fields

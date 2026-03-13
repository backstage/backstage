---
status: completed
priority: p2
issue_id: '025'
tags: [code-review, agent-native, dx]
dependencies: []
---

# 025 — No action to check Atlassian session status — agents cannot verify prerequisite before acting

## Problem Statement

Every Jira action throws `'No valid Atlassian session found. Please sign in with Atlassian via Backstage before using this action.'` when the user has no stored token. There is no agent-callable action to check whether a token exists **before** attempting a Jira operation.

This creates a poor agentic experience:

1. An agent building a multi-step Jira workflow calls `atlassian:jira:getIssue`
2. Receives an error because the user hasn't connected their Atlassian account
3. Must surface the error to the user after the fact, interrupting the workflow mid-execution
4. Has no way to proactively detect the missing session at plan-time

The correct agentic pattern is to check the precondition first (session status), then execute
the workflow. Without a check action, the agent's only option is to attempt an operation and
handle the error — a reactive pattern that wastes user interactions.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` lines 44-51**: `getAtlassianToken()` is the only session check, and it throws on miss — no non-throwing check available
- All three action descriptions say "The user must have signed in with Atlassian via Backstage" but provide no reference to how to check or fix this precondition

## Proposed Solution

Add a `atlassian:auth:checkSession` action (or `atlassian:jira:getSessionStatus`) that returns
the session state without attempting any Jira API call:

```typescript
actions.register({
  name: 'atlassian:auth:checkSession',
  title: 'Check Atlassian Session',
  description:
    'Check whether the current user has an active Atlassian OAuth session stored in Backstage. ' +
    'Call this before any other Atlassian action to verify the prerequisite is met.',
  attributes: { readOnly: true, idempotent: true },
  schema: {
    input: z => z.object({}),
    output: z =>
      z.object({
        hasSession: z
          .boolean()
          .describe('Whether a valid Atlassian session is stored'),
        expiresAt: z
          .string()
          .optional()
          .describe('ISO 8601 expiry time of the current token'),
      }),
  },
  async action(ctx) {
    if (!auth.isPrincipal(ctx.credentials, 'user')) {
      throw new Error('This action requires a user principal.');
    }
    const token = await tokenService.getToken(
      ctx.credentials.principal.userEntityRef,
      'atlassian',
    );
    return {
      output: {
        hasSession: !!token,
        expiresAt: token?.expiresAt?.toISOString(),
      },
    };
  },
});
```

Additionally, update all three Jira action descriptions to reference this check:

```
"Requires an active Atlassian session. Call atlassian:auth:checkSession first to verify."
```

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — add `atlassian:auth:checkSession` action and update descriptions
- `plugins/atlassian-actions-backend/src/plugin.test.ts` — add test for the new action

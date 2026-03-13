---
status: completed
priority: p2
issue_id: '017'
tags: [code-review, security, correctness]
dependencies: []
---

# 017 — `userEntityNamespace` and provider usernames not validated before constructing entity ref

## Problem Statement

The auth capture modules construct a `userEntityRef` by interpolating user-supplied or
operator-supplied values without format validation:

```typescript
// auth-backend-module-atlassian-token-capture/src/module.ts
const namespace = options.userEntityNamespace ?? 'default';
const userEntityRef = `user:${namespace}/${username}`;
```

Both `namespace` (from operator app-config) and `username` (from the OAuth provider's profile)
can contain characters that produce a malformed or ambiguous entity ref:

- A `namespace` containing `/` or `:` breaks the `user:namespace/name` structure
- A `username` containing `/` produces `user:default/first/second`, which is parsed as a different entity
- Atypical characters in either value cause the DB key to diverge from the canonical Backstage entity ref, meaning `getToken` lookups will never find the row

The `userEntityNamespace` schema accepts `z.string().optional()` — no format constraint.

## Findings

- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts` line 39**: `z.string().optional()` — no regex constraint
- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts` line 53**: `const namespace = options.userEntityNamespace ?? 'default'` — unvalidated
- **`plugins/auth-backend-module-atlassian-token-capture/src/module.ts` line 55**: `const userEntityRef = \`user:${namespace}/${username}\`` — unvalidated interpolation
- **`plugins/auth-backend-module-github-token-capture/src/module.ts`**: Same pattern

## Proposed Solution

1. Add a regex constraint to the namespace option:

```typescript
optionsSchema: z.object({
  dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
  userEntityNamespace: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/).optional(),
}).optional(),
```

2. Validate the username from the OAuth profile before constructing the ref. Use Backstage's `parseEntityRef` to validate the resulting string:

```typescript
import { parseEntityRef } from '@backstage/catalog-model';

const userEntityRef = `user:${namespace}/${username}`;
try {
  parseEntityRef(userEntityRef);
} catch {
  throw new Error(
    `OAuth username '${username}' produces an invalid Backstage entity ref`,
  );
}
```

3. Add a test case with a username containing `/` to verify the error path.

## Files to Change

- `plugins/auth-backend-module-atlassian-token-capture/src/module.ts`
- `plugins/auth-backend-module-github-token-capture/src/module.ts`
- `plugins/auth-backend-module-microsoft-token-capture/src/module.ts` (uses different field but same risk)

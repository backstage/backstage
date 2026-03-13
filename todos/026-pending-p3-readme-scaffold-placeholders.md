---
status: pending
priority: p3
issue_id: '026'
tags: [code-review, documentation]
dependencies: []
---

# 026 — Auth capture module READMEs are unmodified scaffold placeholders

## Problem Statement

The three auth capture module packages have README.md files that are unmodified `yarn new`
scaffolding output:

```
# auth-backend-module-atlassian-token-capture

Welcome to the atlassian-token-capture plugin!
```

These contain no documentation about:

- What the module does (captures OAuth tokens at Atlassian sign-in)
- Why it replaces the upstream module (same `moduleId: 'atlassian-provider'`)
- How to install it (remove upstream, add this one)
- What configuration is required
- The security implications of the module replacement pattern

The module replacement pattern (same `moduleId`) is particularly important to document — an
operator who installs both this module and the upstream `@backstage/plugin-auth-backend-module-atlassian-provider`
will get a runtime error that is confusing without context.

## Findings

- **`plugins/auth-backend-module-atlassian-token-capture/README.md`**: Scaffold placeholder
- **`plugins/auth-backend-module-github-token-capture/README.md`**: Scaffold placeholder
- **`plugins/auth-backend-module-microsoft-token-capture/README.md`**: Scaffold placeholder

## Proposed Solution

Write minimal but accurate READMEs for each auth capture module covering:

1. One-sentence description of what it does
2. Installation: remove the upstream module, add this one (with exact `backend.add` call)
3. Configuration options (namespace, dangerouslyAllowSignInWithoutUserInCatalog)
4. A note that it uses `moduleId: '{provider}-provider'` — cannot coexist with the upstream

## Files to Change

- `plugins/auth-backend-module-atlassian-token-capture/README.md`
- `plugins/auth-backend-module-github-token-capture/README.md`
- `plugins/auth-backend-module-microsoft-token-capture/README.md`

---
status: completed
priority: p3
issue_id: '028'
tags: [code-review, security, observability]
dependencies: []
---

# 028 — `cloudId` logged at `info` level on startup exposes infrastructure identifier

## Problem Statement

On plugin startup, the atlassian-actions plugin logs the Atlassian `cloudId` at `info` level:

```typescript
logger.info('Atlassian actions registered', { cloudId });
```

`cloudId` is an Atlassian workspace identifier (a UUID-like string). It is not a secret, but
it is an internal infrastructure identifier. Exposing it in logs at `info` level means it appears
in:

- Default log aggregation pipelines (Datadog, Splunk, CloudWatch, etc.)
- Any log export or forwarding configured in the deployment
- Debug log bundles shared with support

An attacker who obtains `cloudId` from logs can use it to construct targeted Atlassian API
URLs and narrow their attack surface if a vulnerability were later discovered in the Jira action
integration.

## Findings

- **`plugins/atlassian-actions-backend/src/plugin.ts` line 373**: `logger.info('Atlassian actions registered', { cloudId })`

## Proposed Solution

Downgrade to `debug` level for the startup confirmation log:

```typescript
logger.debug('Atlassian actions registered', { cloudId });
```

Or emit only a redacted indicator at `info` level to confirm startup without exposing the full value:

```typescript
logger.info('Atlassian actions registered', {
  cloudIdPrefix: cloudId.substring(0, 4) + '...',
});
```

Either approach confirms plugin initialization in operational logs without exposing the full
infrastructure identifier.

## Files to Change

- `plugins/atlassian-actions-backend/src/plugin.ts` — change `logger.info` to `logger.debug` on line 373

# @backstage/plugin-ai-common

Fixed permissions and resource types for the Backstage managed AI service, shared
by the backend packages and by policy authors.

```ts
import {
  aiModelUsePermission,
  aiToolUsePermission,
  aiSessionUsePermission,
  aiAuditReadPermission,
  RESOURCE_TYPE_AI_MODEL,
  RESOURCE_TYPE_AI_TOOL,
} from '@backstage/plugin-ai-common';
```

There is one permission per resource kind, never one per model or per tool:
`ai.model.use` covers every cataloged model and `ai.tool.use` covers every
registered tool. Granularity comes from the conditions a policy attaches, using
the rules exported by `@backstage/plugin-ai-backend/alpha` (models) and
`@backstage/ai-node/alpha` (model and tool rules).

**A blanket `ALLOW` on `ai.model.use` or `ai.tool.use` grants every cataloged
model or registered tool.** The default posture is deny: a policy that does not
resolve the permission to an `ALLOW`, directly or through a condition, denies
the request.

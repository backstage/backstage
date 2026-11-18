---
'@backstage/plugin-ai-common': minor
---

Added a new `@backstage/plugin-ai-common` package: the fixed permissions and resource types for the managed AI service, as the stable surface policy authors import. It defines `aiModelUsePermission` (`ai.model.use`) over the `ai-model` resource type, `aiToolUsePermission` (`ai.tool.use`) over `ai-tool`, and the `aiSessionUsePermission` and `aiAuditReadPermission` basic permissions, together with the `AiModelResource` and `AiToolResource` shapes the rules receive. Names are plain strings with no per-resource construction: granularity lives in the model and tool rules, so a policy that allows either permission without conditions grants every cataloged model or every registered tool, and the default posture is deny.

The package also carries `ai.feature.use` over the `ai-feature` resource type, the fixed permission harness features are authorized against (the `ai-tool` resource attributes gained the requesting `pluginId`, so tool scoping per plugin is a rule).

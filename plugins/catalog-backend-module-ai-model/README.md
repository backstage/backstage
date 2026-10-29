# @backstage/plugin-catalog-backend-module-ai-model

Adds support for the `AiResource` entity kind to the catalog backend plugin. AI resources represent contextual information consumed by AI coding tools, such as skills and rules.

## Installation

Add the module to your backend:

```ts
backend.add(import('@backstage/plugin-catalog-backend-module-ai-model'));
```

## Entity shape

```yaml
apiVersion: backstage.io/v1alpha1
kind: AiResource
metadata:
  name: frontend-design
  description: Skill for creating production-grade frontend interfaces
spec:
  type: skill
  lifecycle: production
  owner: ai-platform-team
  system: ai-tooling
  disciplines:
    - web
  categories:
    - framework
  agents:
    - claude-code
  dependsOn:
    - airesource:default/base-coding-standards
```

The `type` field determines which spec fields are available. Currently supported types:

- **`skill`** — reusable contextual knowledge for AI coding tools. Supports additional fields: `disciplines`, `categories`, `agents`, `dependsOn`.
- **`rule`** — governance rules and constraints for AI coding tools. Supports additional fields: `disciplines`, `category` (required), `rationale` (required).

Any other `type` value is accepted with the base spec fields: `type`, `lifecycle`, `owner`, and optionally `system`.

## Relations to custom kinds

This module registers a catalog model source, which also enables model-based
processing for built-in kinds. If `Component` or `Resource` entities refer to
custom kinds through `dependsOn` or `dependencyOf`, declare the corresponding
relation pairs in a catalog model layer to have the inverse relations emitted.
See the [catalog model layer guidance](../../docs/features/software-catalog/extending-the-model.md#relations-to-custom-kinds-with-catalog-model-layers)
for an example. Relation fields with `allowedKinds` restrictions continue to
enforce those restrictions.

## Accessing skill and rule content

The actual content of skills and rules is not stored in the entity spec. Instead, the source file is referenced via the standard `backstage.io/source-location` annotation, consistent with how other Backstage entities reference their source files. Entity providers that generate `AiResource` entities from `SKILL.md` or rule files should set this annotation to point to the source file.

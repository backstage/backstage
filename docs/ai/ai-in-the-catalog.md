---
id: ai-in-the-catalog
title: AI in the Software Catalog
description: How to model AI-related resources in the Backstage Software Catalog, including AiResource entities, MCP server APIs, and their relationships.
---

Backstage has catalog entity types for modeling AI-related resources alongside your other software components. You can track ownership, lifecycle, and relationships for AI skills, governance rules, and MCP servers the same way you do for the rest of your catalog.

All entities described on this page use the standard [metadata fields](../features/software-catalog/descriptor-format.md#common-to-all-kinds-the-metadata) such as `name`, `description`, `tags`, `annotations`, and `labels`.

## Installation

Both the `AiResource` entity kind and the `mcp-server` API type are provided by the `@backstage/plugin-catalog-backend-module-ai-model` module. Add it to your backend:

```bash title="From your root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-ai-model
```

```ts title="packages/backend/src/index.ts"
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-catalog-backend-module-ai-model'));
// ...
backend.start();
```

## AiResource Entity Kind

The `AiResource` entity kind represents contextual information consumed by AI coding tools, such as skills and governance rules. The `spec.type` field determines which additional spec fields are available.

### Skill

Skills are reusable contextual knowledge for AI coding tools.

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

Skill-specific fields:

- `disciplines` (optional): A list of disciplines the skill applies to, such as `web` or `backend`.
- `categories` (optional): A list of categories for organizing skills.
- `agents` (optional): A list of AI agents the skill is designed for.
- `dependsOn` (optional): References to other `AiResource` entities this skill depends on.

### Rule

Rules define constraints and governance policies for AI coding tools.

```yaml
apiVersion: backstage.io/v1alpha1
kind: AiResource
metadata:
  name: no-direct-db-access
  description: Prevent AI tools from generating direct database queries
spec:
  type: rule
  lifecycle: production
  owner: platform-team
  category: security
  rationale: All database access must go through the service layer to maintain audit trails
  disciplines:
    - backend
```

Rule-specific fields:

- `category` (required): The category of the rule, such as `security` or `quality`.
- `rationale` (required): An explanation of why the rule exists.
- `disciplines` (optional): A list of disciplines the rule applies to.

### Base Fields

All `AiResource` entities share these spec fields regardless of type:

- `type` (required): The type of AI resource. Supported values are `skill` and `rule`, but any string is accepted.
- `lifecycle` (required): The lifecycle stage of the resource, such as `experimental` or `production`.
- `owner` (required): A reference to the owning entity, typically a group or user.
- `system` (optional): A reference to the system this resource belongs to.

### Accessing Skill and Rule Content

The actual content of skills and rules is not stored in the entity spec. Instead, the source file is referenced through the standard `backstage.io/source-location` annotation. Entity providers that generate `AiResource` entities from skill or rule files should set this annotation to point to the source file.

## MCP Server API Type

The `mcp-server` type is a structured subtype of the [`API` entity kind](../features/software-catalog/descriptor-format.md#kind-api). Use it to represent MCP servers in your catalog, capturing their transport endpoints through a `remotes` list instead of the `definition` field used by other API types like `openapi` or `graphql`.

```yaml
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: backstage-mcp-server
  description: An MCP server that exposes tools related to the Backstage ecosystem
  tags:
    - mcp
    - ai
spec:
  type: mcp-server
  lifecycle: experimental
  owner: team-a
  remotes:
    - type: streamable-http
      url: http://localhost:7007/api/mcp-actions/v1
```

### Fields

- `type` (required): Must be `mcp-server`.
- `lifecycle` (required): The lifecycle stage of the server, such as `experimental` or `production`.
- `owner` (required): A reference to the owning entity, typically a group or user.
- `system` (optional): A reference to the system this server belongs to.
- `remotes` (required): An array of transport endpoints, with at least one entry. Each entry has:
  - `type` (required): The transport protocol, such as `streamable-http` or `stdio`.
  - `url` (required): The endpoint URL for the MCP server.

# backstage-intent CLI Reference

Intent-based wrapper around `backstage-cli actions execute`. Each subcommand maps to a specific Backstage action, translating human/agent-friendly flags into the underlying action's parameters.

## Prerequisites

- Authenticated via `backstage-intent auth login --backend-url <URL>`

## Intent → Action Mapping

### Catalog

| Intent Command       | Backstage Action                 | Description                         |
| -------------------- | -------------------------------- | ----------------------------------- |
| `catalog list`       | `catalog:query-catalog-entities` | List entities with optional filters |
| `catalog get`        | `catalog:get-catalog-entity`     | Get a single entity by name         |
| `catalog validate`   | `catalog:validate-entity`        | Validate entity YAML                |
| `catalog register`   | `catalog:register-entity`        | Register entity from URL            |
| `catalog unregister` | `catalog:unregister-entity`      | Unregister entity by location       |

#### `catalog list`

```
backstage-intent catalog list [--kind <kind>] [--type <type>] [--filter <json>] [--limit <n>] [--fields <json>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| `--kind Component` | `--query '{"kind":"Component"}'` | Wrapped into query predicate |
| `--type service` | `--query '{"spec.type":"service"}'` | Wrapped into query predicate |
| `--filter '{"kind":"API"}'` | `--query '{"kind":"API"}'` | Passed directly as query |
| `--limit 10` | `--limit 10` | Passed through |
| `--fields '["kind","metadata.name"]'` | `--fields '["kind","metadata.name"]'` | Passed through |

#### `catalog get`

```
backstage-intent catalog get --name <name> [--kind <kind>] [--namespace <ns>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter |
|---|---|
| `--name my-service` | `--name my-service` |
| `--kind Component` | `--kind Component` |
| `--namespace default` | `--namespace default` |

#### `catalog validate`

```
backstage-intent catalog validate --entity <yaml> [--location <url>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter |
|---|---|
| `--entity "$(cat entity.yaml)"` | `--entity "$(cat entity.yaml)"` |
| `--location <url>` | `--location <url>` |

#### `catalog register`

```
backstage-intent catalog register --location-url <url> [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter |
|---|---|
| `--location-url <url>` | `--locationUrl <url>` |

#### `catalog unregister`

```
backstage-intent catalog unregister [--location-id <id>] [--location-url <url>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter |
|---|---|
| `--location-id <id>` | `--type '{"locationId":"<id>"}'` |
| `--location-url <url>` | `--type '{"locationUrl":"<url>"}'` |

---

### API

| Intent Command | Backstage Action                 | Description                  |
| -------------- | -------------------------------- | ---------------------------- |
| `api list`     | `catalog:query-catalog-entities` | List API entities (kind=API) |
| `api get-spec` | `catalog:get-catalog-entity`     | Get full API spec definition |

#### `api list`

```
backstage-intent api list [--type <api-type>] [--limit <n>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| (implicit) | `--query '{"kind":"API"}'` | Always filters to kind=API |
| `--type openapi` | `--query '{"kind":"API","spec.type":"openapi"}'` | Added to query |

#### `api get-spec`

```
backstage-intent api get-spec --name <name> [--namespace <ns>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| `--name my-api` | `--name my-api` | |
| (implicit) | `--kind API` | Always fetches kind=API |

**Post-processing:** Extracts `spec.definition` from the entity response. In human mode, prints the raw spec content (OpenAPI YAML, protobuf, GraphQL SDL, etc.). In JSON mode, returns `{name, type, definition}`.

---

### Search

| Intent Command  | Backstage Action | Description              |
| --------------- | ---------------- | ------------------------ |
| `search <term>` | `search:query`   | Search all content types |

#### `search`

```
backstage-intent search <term> [--types <json>] [--filters <json>] [--page-limit <n>] [--page-cursor <cursor>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter |
|---|---|
| `<term>` (positional) | `--term <term>` |
| `--types '["techdocs"]'` | `--types '["techdocs"]'` |
| `--filters '{"kind":"Component"}'` | `--filters '{"kind":"Component"}'` |
| `--page-limit 20` | `--pageLimit 20` |
| `--page-cursor abc` | `--pageCursor abc` |

---

### Docs

| Intent Command       | Backstage Action                                | Description                          | Availability |
| -------------------- | ----------------------------------------------- | ------------------------------------ | ------------ |
| `docs search <term>` | `search:query`                                  | Search TechDocs content              | Upstream     |
| `docs list`          | `techdocs-mcp-extras:fetch-techdocs`            | List entities with TechDocs metadata | RHDH only    |
| `docs get`           | `techdocs-mcp-extras:retrieve-techdocs-content` | Get doc page content for an entity   | RHDH only    |
| `docs coverage`      | `techdocs-mcp-extras:analyze-techdocs-coverage` | TechDocs coverage report             | RHDH only    |

#### `docs search`

```
backstage-intent docs search <term> [--page-limit <n>] [--page-cursor <cursor>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| `<term>` (positional) | `--term <term>` | |
| (implicit) | `--types '["techdocs"]'` | Always filters to techdocs type |
| `--page-limit 20` | `--pageLimit 20` | |

#### `docs list`

```
backstage-intent docs list [--entity-type <kind>] [--owner <owner>] [--lifecycle <lifecycle>] [--tags <tags>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| `--entity-type Component` | `--entityType Component` | |
| `--owner team-a` | `--owner team-a` | |
| `--lifecycle production` | `--lifecycle production` | |
| `--tags java,spring` | `--tags java,spring` | Comma-separated |

**Requires:** `techdocs-mcp-extras` plugin and action source registered on the instance.

#### `docs get`

```
backstage-intent docs get --entity-ref <ref> [--page-path <path>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| `--entity-ref component:default/my-service` | `--entityRef component:default/my-service` | Required |
| `--page-path getting-started` | `--pagePath getting-started` | Default: index page |

**Post-processing:** In human mode, prints the doc content as plain text (HTML→text conversion done server-side). In JSON mode, returns the full action response.

**Requires:** `techdocs-mcp-extras` plugin and action source registered on the instance.

#### `docs coverage`

```
backstage-intent docs coverage [--output json] [--instance <name>]
```

**Flag mapping:** No input flags — calls `techdocs-mcp-extras:analyze-techdocs-coverage` with no parameters.

**Post-processing:** In human mode, shows a formatted report:

```
TechDocs Coverage Report

Total entities:       236
Documented entities:  15
Coverage:             6.4%
```

**Requires:** `techdocs-mcp-extras` plugin and action source registered on the instance.

---

### Template

| Intent Command     | Backstage Action                                              | Description                   |
| ------------------ | ------------------------------------------------------------- | ----------------------------- |
| `template list`    | `catalog:query-catalog-entities`                              | List software templates       |
| `template execute` | `scaffolder:execute-template` / `scaffolder:dry-run-template` | Execute or dry-run a template |

#### `template list`

```
backstage-intent template list [--limit <n>] [--output json] [--instance <name>]
```

**Flag mapping:**
| Intent Flag | Action Parameter | Notes |
|---|---|---|
| (implicit) | `--query '{"kind":"Template"}'` | Always filters to kind=Template |

#### `template execute`

```
backstage-intent template execute --template-ref <ref> [--values <json>] [--secrets <json>] [--confirm] [--output json] [--instance <name>]
```

**Safe-by-default:** Without `--confirm`, calls `scaffolder:dry-run-template`. With `--confirm`, calls `scaffolder:execute-template`.

**Flag mapping (dry-run, no --confirm):**
| Intent Flag | Action Parameter |
|---|---|
| `--template-ref template:default/my-tpl` | `--templateYaml template:default/my-tpl` |
| `--values '{"name":"app"}'` | `--values '{"name":"app"}'` |

**Flag mapping (real execution, --confirm):**
| Intent Flag | Action Parameter |
|---|---|
| `--template-ref template:default/my-tpl` | `--templateRef template:default/my-tpl` |
| `--values '{"name":"app"}'` (required) | `--values '{"name":"app"}'` |
| `--secrets '{"token":"x"}'` | `--secrets '{"token":"x"}'` |

---

### Auth (inherited from @backstage/cli-module-auth)

| Intent Command     | Description                               |
| ------------------ | ----------------------------------------- |
| `auth login`       | Authenticate against a Backstage instance |
| `auth logout`      | Clear stored credentials                  |
| `auth show`        | Show current instance details             |
| `auth list`        | List all authenticated instances          |
| `auth select`      | Set the default instance                  |
| `auth print-token` | Print access token to stdout              |

These commands are provided directly by `@backstage/cli-module-auth` with no wrapping.

---

## Global Flags

| Flag                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `--output json`     | Structured JSON output (default: human-readable table) |
| `--instance <name>` | Target a specific authenticated instance               |
| `--help`            | Show subcommand surface, flags, and descriptions       |
| `--version`         | Show CLI version                                       |

`NO_COLOR` environment variable suppresses ANSI color codes.

## Output Modes

**Human mode (default):** Tabular output for entity lists, formatted text for specs and search results.

**JSON mode (`--output=json`):** Raw JSON from `backstage-cli actions execute`, passed through unmodified. For `api get-spec`, returns `{name, type, definition}`.

## Error Format

**Human mode:**

```
Error: Entity "missing" not found (kind=Component, namespace=default)

The requested resource was not found. Check the entity name, kind, or namespace.

Try:
  backstage-intent catalog list --kind Component
```

**JSON mode:**

```json
{ "error": "...", "reason": "...", "suggestion": "..." }
```

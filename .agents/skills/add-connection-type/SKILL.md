---
name: add-connection-type
description: Add or evolve a built-in Backstage connection type with provider-specific credentials, URL handling, tests and configuration/consumption guides. Use for contributions to packages/connections in the Backstage monorepo, not app configuration or external type registration.
---

# Add a connection type

Start with the [contribution guide](../../../docs/backend-system/core-services/connections/05-creating-a-connection-type.md)
and the checked-out APIs in [connections](../../../packages/connections/src).
Keep the definition small enough for multiple plugins to share. Use merged
code as the implementation baseline; pending changes are review context.

## Establish the provider contract

Read official authentication and API documentation and inspect real consumers.
Identify the credentials plugins need, any useful anonymous access, and regional
or tenant endpoint choices. Do not invent methods or fields for hypothetical
consumers. Research may inspect existing plugins, but provider guides should
teach the connection itself, without plugin adoption or migration sections.

Choose identity separately from request destinations. Read
[endpoint contracts](references/endpoints.md) when adding URL fields: the shared
helper normalizes roots but does not compute API addresses. Preserve explicit
internal destinations and installation paths. Do not infer regions, tenant IDs,
scopes or API gateways without a provider contract that supports it.

## Implement the definition

Use `createConnectionType` with `zod/v4`. For a URL-based provider, follow
[the Grafana definition](../../../packages/connections/src/schema/grafana.ts):
spread `withBaseUrl(z.object({ ... }))` into the definition and use
`connectionBaseUrlSchema` for API roots. This adds required `baseUrl` and its
lookup identity; do not add a configured or returned `host` field.

Use the shared HTTP(S) validation rather than repeating HTTPS-only or DNS
hostname checks. See the endpoint reference for accepted roots and joining
rules. Add provider-specific restrictions only when required by its API,
explaining why they are needed.

Keep connection fields separate from credentials in `authMethods`. The framework
owns `type`, `title`, `match` and `auth` on connections, and `method`, `title`
and `match` on authentication entries; do not define them again in field schemas.
Use field schemas for local parsing and `validate` for real cross-field or
cross-entry rules. Prefer standard parsers and small predicates over complex
regular expressions. Keep token exchange, client construction and plugin settings out of
the definition.

Register and export the type in
[definitions/types.ts](../../../packages/connections/src/definitions/types.ts)
and [definitions/index.ts](../../../packages/connections/src/definitions/index.ts).
The registry provides inferred public types; avoid separate connection or auth
interfaces. Omit the default `multiton` cardinality. `createConnectionType` is
internal framework code, not an external plugin registration API.

Before adding `matchAuth`, read
[DefaultConnectionsService](../../../packages/connections-node/src/DefaultConnectionsService.ts).
Plugin filtering happens first; the selected entry is then checked against the
consumer's supported methods. An unsupported selected method fails without
retrying later credentials. Without `matchAuth`, the first visible entry wins.
Add provider-specific selection only when necessary and explain its priority.

If the task includes legacy conversion, inspect
[getLegacyIntegrations](../../../packages/connections/src/config/getLegacyIntegrations.ts)
and its tests. Preserve explicit destinations and authentication semantics;
similarly named integration fields do not prove compatibility.

## Write the provider guide

Use [Grafana's guide](../../../docs/backend-system/core-services/connections/types/grafana.md)
as the voice and structure reference, not a length target. Write direct
instructions for the person doing the task. Put the guide in the
[connection documentation](../../../docs/backend-system/core-services/connections.md)
and link it from the [built-in type index](../../../docs/backend-system/core-services/connections/04-built-in-connection-types.md),
keeping the list sorted within its section.

- **Configuring:** before YAML, name the credential kind and necessary access,
  and link official instructions for creating it. Keep this preparation brief;
  link full provider administration instructions rather than reproducing menus
  or role matrices. Retain deployment and authentication alternatives that change
  the configuration. Use short task subheadings for setup and address choices.
- **Consuming:** use a task heading such as reading a resource or listing results.
  Show a short typed lookup and real request using returned connection data,
  with the correct authentication header and API path. Explain the resulting
  request address and how omission or an override changes it. Keep concrete
  examples of API prefixes, internal routing and context paths where relevant.
  Handle failed responses and keep credentials in the backend.

Explain the reader's choices and where requests go. Avoid inventories of schema
requirements or internal output facts; mention a constraint only when it prevents
an identifiable configuration or request mistake. Distinguish site roots from
API roots and state which path prefixes belong in each. When browser and API
destinations differ, explain which root builds browser links and which receives
authenticated requests. Request only the auth methods the example implements. Support `none` only where the provider permits
the illustrated read.

Link the shared [lookup and credential selection rules](../../../docs/backend-system/core-services/connections/01-concepts.md#what-happens-during-find),
[plugin scoping](../../../docs/backend-system/core-services/connections/01-concepts.md#plugin-scoping)
and [backend credential handling](../../../docs/backend-system/core-services/connections/03-consuming-connections.md#keep-connection-data-on-the-backend)
where needed. Do not restate the selection algorithm or add a generic closing
paragraph about validation, permissions, redirects and backend security to every
guide. Keep provider-specific decisions and necessary request handling in
context. The implementation and testing guidance in this skill is not an outline
for the provider guide. Avoid whole-plugin scaffolding, speculative adoption
plans, repeated summaries and forced reference tables.

## Verify the result

Use a few thorough tests covering schema parsing, auth methods, inferred returned
output and any selection or cross-field rules. Check portable draft-07 **input**
JSON Schema export separately from parsed output. Refinements, transforms and
whole-connection validation can differ from that schema; test and explain
meaningful differences rather than building a large regex for parity.

For URL fields, cover omitted optional API roots, explicit different-host or
internal addresses, encoded context paths and both trailing-slash forms. Resolve
relative paths directly against parsed or service-returned roots; do not repair
URLs inside the test. Assert lookup identity, host absence in returned runtime
and public types, duplicate-host handling and plugin-scoped credentials. Exercise
legacy conversion when changed.

Follow repository setup and required checks, including focused tests, formatting
changed files, root type checking and API reports for package changes. Inspect
existing changesets before adding coverage. Summarize actual outcomes and any
checks that could not run. Stay within the requested delivery scope; adding a
definition does not authorize publication or changes to existing plugins.

# Catalog Model Extensions Design

## Problem Statement

The Backstage catalog model is static and monolithic. Eight kinds (Component, API, System, Domain, Resource, User, Group, Location) are hardcoded in @backstage/catalog-model. Validation uses JSON Schema (Draft-07) compiled with AJV. Relation materialization lives in BuiltinKindsEntityProcessor as ~230 lines of hardcoded emit() calls (spec.owner → owner/ownerOf, spec.providesApis → providesApi/apiProvidedBy, etc).

Plugins and modules cannot:
- Add fields to existing kinds with validation and descriptions
- Narrow existing field types (e.g., spec.type from open string to enum)
- Define new kinds with metadata and validation
- Declare what relations a spec field produces
- Contribute to a schema usable by MCP tools and LLM context

This forces all extensions outside the core or requires hacking around the model.

## Goals

1. Plugins/modules register schema extensions for existing kinds (add fields, tighten validation)
2. New kinds defined with metadata (singular/plural names, shortNames, description, categories)
3. Relation declarations colocated with field definitions, not in separate processor code
4. Composed model serializes to JSON Schema and TypeScript types
5. Schema includes field descriptions for MCP/LLM consumption
6. Multiple plugins extending the same field merge correctly (enum union, property merge)
7. additionalProperties: true by default (configurable per kind)

## Current Architecture

**catalog-model**: Entity types, JSON Schema files (Component.v1alpha1.schema.json), KindValidator interface, EntityPolicy

**catalog-backend**: CatalogProcessor interface, CatalogBuilder, BuiltinKindsEntityProcessor

**Relation handling**: Hand-written emit() calls in BuiltinKindsEntityProcessor. For example:

```typescript
// spec.owner → RELATION_OWNED_BY (outgoing) + RELATION_OWNER_OF (incoming)
doEmit(
  component.spec.owner,
  { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
);
```

No declarative relation metadata. Relations are discovered by reading processor code.

## POC Approaches

### POC 1: Zod 3 + Scaffolder-style

Reuse Zod 3 (^3.25.76) with the proven (z) ⇒ ... callback pattern from scaffolder. Plugin authors write:

```typescript
catalogRegistry.registerKindSchema('Component', z => z.object({
  spec: z.object({
    owner: z.string().describe('Team that owns this component'),
    customField: z.enum(['a', 'b']).describe('Custom extension field'),
  }),
}));
```

JSON Schema conversion via zod-to-json-schema library. Relation declarations are a separate object mapping spec paths to { forward, reverse } relation tuples. Helper utilities (entityRef, lifecycle) are standalone functions.

**Trade-offs**: Familiar pattern (scaffolder devs know it), Zod 3 already in use, requires external zod-to-json-schema conversion library.

### POC 2: Zod 4 + Scaffolder-style

Same pattern as POC 1 but Zod 4 (^4.3.6). Uses native z.toJsonSchema() instead of zod-to-json-schema. Explores what Zod 4 brings (potentially better type inference, native JSON Schema support).

**Trade-offs**: New Zod version dependency, native JSON Schema generation, unknown compatibility with existing zod-to-json-schema patterns.

### POC 3: Custom DSL + Lazy Container

Purpose-built model.field.* API. Plugin authors never see Zod directly:

```typescript
catalogRegistry.getKind('Component').field('owner', {
  type: 'string',
  description: 'Team that owns this component',
  relations: {
    forward: RELATION_OWNED_BY,
    reverse: RELATION_OWNER_OF,
  },
});
```

A lazy resolution container handles registration order—model.getKind() returns a proxy that resolves after all plugins initialize. Cross-kind field reuse is first-class (shared definitions for owner, lifecycle, etc). Zod powers internals for validation.

**Trade-offs**: Lower learning curve (no Zod knowledge), order independence, more code to maintain, tighter coupling to catalog semantics.

### POC 4: Zod 4 + Extended z + Lazy Container (Hybrid)

Zod 4 + lazy resolution container. The callback receives an extended z (CatalogZ) with z.entityRef(), z.lifecycle(), z.withRelations() helpers:

```typescript
catalogRegistry.registerKindSchema('Component', (z) => z.object({
  spec: z.object({
    owner: z.entityRef({
      defaultKind: 'Group',
      relations: { forward: RELATION_OWNED_BY, reverse: RELATION_OWNER_OF },
    }),
    customField: z.string().describe('Custom field'),
  }),
}));
```

Plugin authors write standard Zod but get catalog-specific helpers and order independence via lazy container. Model.getKind() resolves after all plugins initialize.

**Trade-offs**: Best DX (Zod + helpers), order independent, requires both Zod 4 and custom container logic.

## Trade-off Comparison

| Aspect | POC 1 (Zod 3) | POC 2 (Zod 4) | POC 3 (DSL) | POC 4 (Hybrid) |
|--------|---------------|---------------|-------------|----------------|
| Learning curve | Moderate (Zod) | Moderate (Zod) | Low (custom API) | Moderate (Zod) |
| TypeScript inference | Good | Better | Good | Better |
| JSON Schema output | Via library | Native | Via Zod internal | Native |
| Relation declarations | Separate object | Separate object | Inline with field | Inline with z.* |
| Cross-kind references | Functions only | Functions only | Built-in | Via z.* helpers |
| Registration order matters | Yes | Yes | No | No |
| New dependencies | zod-to-json-schema | None | None | None (Zod 4 already in) |
| Migration from JSON Schema | Moderate | Moderate | Hard | Moderate |
| Catalog-specific helpers | z.entityRef() helper | z.entityRef() helper | model.field.* API | z.entityRef() etc |

## Open Questions

1. Extension point or serviceRef for registration? Extension points allow discovery at bootstrap; serviceRef requires explicit wiring.

2. Registry available at compile time (code generation) or runtime only? Code generation enables static schema validation and IDE tooling but requires build step.

3. Breaking changes when plugin removes field extension? Should there be a deprecation/removal policy?

4. Field deprecation marker? How to signal fields are going away?

5. Interaction with SchemaValidEntityPolicy and FieldFormatEntityPolicy? Do these become pluggable?

6. What about additionalProperties on nested objects? Default to true everywhere or configurable per level?

## POC Code

Reference implementations in:
- poc-1-zod3/
- poc-2-zod4/
- poc-3-custom-dsl/
- poc-4-zod4-container/

Each POC implements the same schema: Component with owner, lifecycle, and a hypothetical custom field. Each generates JSON Schema, TypeScript types, and demonstrates relation declaration patterns.

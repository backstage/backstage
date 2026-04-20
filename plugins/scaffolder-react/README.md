# Scaffolder React

This is shared code of the frontend part of the default Scaffolder plugin.

It will implement the core API for working with the Scaffolder, and
supplies components that can be reused by third-party plugins.

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/scaffolder)
- [Backend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend)
- [The Backstage homepage](https://backstage.io)

## Cascading/Dynamic Forms

The Scaffolder multi-step wizard supports cascading and dynamic form capabilities,
enabling reactive field behavior driven by standard JSON Schema conditional keywords.
Template authors can declare field dependencies using `if/then/else` and `dependencies`
keywords directly in their template YAML files. The form evaluates these declarations
reactively — dependent fields mount and unmount within the same render cycle as the
triggering field change, with no page navigation or manual refresh required.

### Supported JSON Schema Patterns

#### `if/then/else` — Conditional Field Visibility

Use JSON Schema `if/then/else` to show or hide fields based on the value of a parent
field. When the `if` condition evaluates to true against the current form data, the
properties declared in `then` are merged into the active schema. Otherwise, properties
from `else` (if present) are merged instead.

**Example — Show a "region" field only when the cloud provider is "AWS":**

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: deploy-service
spec:
  parameters:
    - title: Infrastructure
      properties:
        cloudProvider:
          type: string
          title: Cloud Provider
          enum:
            - AWS
            - GCP
            - Azure
      if:
        properties:
          cloudProvider:
            const: AWS
      then:
        properties:
          awsRegion:
            type: string
            title: AWS Region
            enum:
              - us-east-1
              - us-west-2
              - eu-west-1
        required:
          - awsRegion
      else:
        properties:
          genericRegion:
            type: string
            title: Region
```

When the user selects **AWS**, the `awsRegion` field appears and becomes required.
Selecting any other provider shows the `genericRegion` field instead.

#### `dependencies` — Property and Schema Dependencies

The `dependencies` keyword supports two forms:

**Property dependencies** — When field A is present (non-empty), field B becomes required:

```yaml
properties:
  enableNotifications:
    type: boolean
    title: Enable Notifications
  notificationEmail:
    type: string
    title: Notification Email
dependencies:
  enableNotifications:
    - notificationEmail
```

**Schema dependencies** — When a dependency field is present, an additional sub-schema
is merged into the active schema:

```yaml
properties:
  databaseType:
    type: string
    title: Database Type
    enum:
      - postgres
      - mysql
dependencies:
  databaseType:
    oneOf:
      - properties:
          databaseType:
            const: postgres
          pgVersion:
            type: string
            title: PostgreSQL Version
            enum:
              - '14'
              - '15'
              - '16'
      - properties:
          databaseType:
            const: mysql
          mysqlVersion:
            type: string
            title: MySQL Version
            enum:
              - '8.0'
              - '8.4'
```

### `optionsLoader` API

Field extensions can declare asynchronous option loading that reacts to sibling field
changes. This is useful when a dependent field's available options must be fetched from
a backend API based on the current value of a parent field.

#### Declaring Dependencies

Add an optional `dependencies` array to your field extension options. Each entry is the
name of a sibling field whose value the extension watches:

```typescript
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';

const RegionPickerExtension = createScaffolderFieldExtension({
  name: 'RegionPicker',
  component: RegionPickerComponent,
  dependencies: ['cloudProvider'],
  optionsLoader: async (formData, { apiHolder }) => {
    const provider = formData.cloudProvider as string;
    if (!provider) return [];

    // Fetch regions from your backend API using the apiHolder
    const catalogApi = apiHolder.get(catalogApiRef);
    const regions = await catalogApi.getEntities({
      filter: { kind: 'Resource', 'spec.type': provider },
    });

    return regions.items.map(entity => ({
      label: entity.metadata.title ?? entity.metadata.name,
      value: entity.metadata.name,
    }));
  },
});
```

#### `optionsLoader` Signature

```typescript
optionsLoader?: (
  formData: JsonObject,
  context: { apiHolder: ApiHolder },
) => Promise<Array<{ label: string; value: string | number }>>;
```

- **`formData`** — The current form data, including values from all wizard steps
  and all sibling field values.
- **`context.apiHolder`** — The Backstage `ApiHolder` instance, giving access to any
  registered API (catalog, scaffolder, custom backends, etc.).

#### Debounce Behavior

`optionsLoader` calls are debounced by **300ms** by default to prevent network request
storms during rapid parent field changes (e.g., typing in a text field). The debounce
interval is configurable per field via `ui:options`:

```yaml
properties:
  region:
    type: string
    ui:field: RegionPicker
    ui:options:
      debounceMs: 500
```

While the loader is in flight, the field displays a loading indicator and is temporarily
disabled. If the loader rejects, an inline error message with a retry button is shown.

### Form Value Preservation

When a conditional field unmounts (because its parent field value changed) and later
remounts (because the parent value changed back), any previously entered value is
automatically restored. For example:

1. User selects **AWS** and fills in `awsRegion = us-east-1`.
2. User switches to **GCP** — the `awsRegion` field unmounts.
3. User switches back to **AWS** — the `awsRegion` field remounts with `us-east-1`
   pre-filled.

This behavior is automatic and requires no additional configuration from template
authors. The Stepper's internal state accumulator preserves all field values across
the form lifecycle, including values from conditionally unmounted fields.

### Common Pitfalls

- **Circular dependencies** — Avoid declaring two fields that each depend on the other
  (e.g., field A watches field B and field B watches field A). This creates an infinite
  update loop. The form will not detect circular references automatically; the template
  author is responsible for ensuring the dependency graph is acyclic.

- **Performance with many conditional branches** — Schema resolution is synchronous and
  must complete in under **50ms** for schemas with up to 20 conditional branches. If
  your template has deeply nested or numerous `if/then/else` blocks, consider
  simplifying by splitting complex logic across multiple wizard steps.

- **`optionsLoader` error handling** — The `optionsLoader` function does not
  impose a built-in timeout. If your backend API may be slow, implement a timeout
  in your loader using `AbortSignal.timeout()` or a similar mechanism, and return
  a meaningful error so the retry button can be used.

- **Synchronous vs. asynchronous resolution** — `resolveConditionalSchema()` is a pure,
  synchronous function that evaluates `if/then/else` and `dependencies` keywords against
  the current form data. All asynchronous behavior (fetching options from APIs) is
  handled separately by the `useOptionsLoader` hook at the field level. Do not attempt
  to perform async operations inside schema resolution logic.

### Backward Compatibility

All new API additions are fully backward-compatible:

- The `dependencies` and `optionsLoader` fields on `FieldExtensionOptions` are
  **optional** and default to `undefined`.
- Existing templates that do not use `if/then/else` or `dependencies` keywords
  render exactly as before — no changes in behavior or appearance.
- Existing field extensions that do not declare `dependencies` or `optionsLoader`
  continue to work without modification.
- The `resolveConditionalSchema()` utility returns the input schema unchanged when
  no conditional keywords are present.

### Decision Log

Non-trivial architectural choices made during the cascading/dynamic forms implementation:

| Decision                            | Options Considered                                                                                                    | Chosen                                                  | Rationale                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema resolution strategy          | (A) Async resolution with caching (B) Pure synchronous resolution                                                     | Pure synchronous (B)                                    | `resolveConditionalSchema` must be called inside `useMemo` on every formData change. Async resolution would require suspense or loading states at the schema level, adding complexity. JSON Schema `if/then/else` evaluation is CPU-bound (no I/O), so synchronous execution completes in <50ms for ≤20 branches.               |
| Debounce timing for `optionsLoader` | (A) 100ms (B) 300ms (C) 500ms                                                                                         | 300ms default, configurable via `ui:options.debounceMs` | 300ms balances responsiveness with network efficiency. 100ms fires too often during typing; 500ms feels sluggish. The configurable override lets template authors tune per field.                                                                                                                                               |
| Form value preservation strategy    | (A) Separate field value cache (B) Reuse existing `stepsState` accumulator                                            | Reuse `stepsState` (B)                                  | The Stepper's `stepsState` already accumulates all field values via `handleChange` and never removes keys. When a conditional field unmounts and later remounts, RJSF receives the full `stepsState` as `formData`, restoring previous values automatically. A separate cache would duplicate state and risk desynchronization. |
| Loading indicator component         | (A) `Skeleton` from `@material-ui/lab` (B) `LinearProgress` indeterminate                                             | `LinearProgress` (B)                                    | `LinearProgress` is already imported and used in the Stepper for validation loading. `Skeleton` would require a new import from `@material-ui/lab`. Using the same indicator component maintains visual consistency across the wizard.                                                                                          |
| Type extension approach             | (A) Create new `CascadingFieldExtensionOptions` type (B) Extend existing `FieldExtensionOptions` with optional fields | Extend existing type (B)                                | Adding optional fields to the existing type preserves backward compatibility — every current `FieldExtensionOptions` value remains valid. A new type would require migration or adapter logic for all downstream consumers.                                                                                                     |
| Error boundary scope                | (A) Single boundary around entire Form (B) Per-field boundary for optionsLoader fields                                | Per-field boundary (B)                                  | A single boundary around the Form would recover by unmounting all fields, losing form state. Per-field boundaries isolate failures so only the affected field shows a recovery UI while the rest of the form remains interactive.                                                                                               |
| Analytics tracking location         | (A) Inside `useOptionsLoader` hook (B) In `FieldTemplate` observing hook state                                        | `FieldTemplate` (B)                                     | `useAnalytics()` must be called in a component under the Analytics provider. The `FieldTemplate` already has the provider context and observes the hook's loading/error state transitions, making it the natural tracking point without coupling the hook to Backstage-specific APIs.                                           |

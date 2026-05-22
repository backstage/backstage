---
id: catalog
sidebar_label: 001 - Catalog
title: Integrating with Catalog
description: How to integrate your plugin with the Backstage Software Catalog
---

## Software Catalog

### What is the Software Catalog?

The [Software Catalog](../../../features/software-catalog/index.md) is the
graph of typed entities that sits at the center of every Backstage instance.
Components, APIs, Resources, Systems, Users, Groups — anything an organization
wants to model and reason about — live in the catalog and are related to each
other through a small set of well-known relations.

Each entity is identified by its `apiVersion`, `kind`, and `metadata.name`
(scoped by `metadata.namespace`). The catalog backend ingests entity
descriptors from one or more _sources_, validates them against a schema, runs
them through a pipeline of _processors_, stitches the resulting relations
together, and exposes the final state through a queryable API that the
frontend and other plugins consume.

For your plugin, the catalog is the place you go when you want a stable,
shared answer to "which thing is this, who owns it, and how does it relate to
everything else?" — rather than maintaining your own list of services, owners,
or resources.

### Integration Points

There are three main places where a plugin can plug into the catalog. Pick the
one that matches the question you are trying to answer.

**Entity providers** push entities into the catalog. They run on a schedule,
fetch data from an external system, and emit a full or delta set of entities
that the catalog should know about. Use a provider when your plugin owns a
source of truth that should appear in the catalog — todos discovered in a
backing store, for example.

**Catalog processors** transform entities as they flow through the ingestion
pipeline. They can read annotations, mutate spec fields, emit additional
entities, or attach extra relations. Use a processor when you want to react to
existing entities or annotations rather than provide a brand-new source.

**The catalog model** controls which kinds, versions, and spec types are
considered valid. Extending the model lets you introduce a new first-class
kind — `Todo`, for example — with its own schema, relations, and type guards.
Use a model extension when your data does not fit comfortably into any of the
built-in kinds.

A typical plugin uses one or two of these together: a provider plus a model
extension to introduce a new kind, or a processor that reads an annotation off
existing entities to expose plugin-specific data.

## Adding a new `backstage.io/todo` annotation

The lightest-weight integration is to attach to entities that already live in
the catalog. Adopters add an annotation to their `catalog-info.yaml`, and your
plugin reacts to it. There is no new kind, no new provider, and the source of
truth stays in the adopter's repository.

### Reserve the annotation name

Annotations are namespaced strings, and the `backstage.io/` prefix is
reserved for annotations defined by the project. For a plugin you ship
yourself, pick a namespace you control — for example
`todo.backstage.io/source` — and document it. For the rest of this guide we
will pretend our plugin is shipped by the Backstage project and use
`backstage.io/todo-source`.

Add a constant in your common package so backend, frontend, and any policies
reference the same string:

```ts
// plugins/todo-common/src/annotations.ts
export const TODO_SOURCE_ANNOTATION = 'backstage.io/todo-source';
```

### Read the annotation in the backend

Inside a route handler, look the entity up through the catalog client and
read the annotation off `metadata.annotations`:

```ts
// plugins/todo-backend/src/service/router.ts
import { CatalogService } from '@backstage/plugin-catalog-node';
import { TODO_SOURCE_ANNOTATION } from '@internal/plugin-todo-common';

router.get('/todos/by-entity/:ref', async (req, res) => {
  const credentials = await httpAuth.credentials(req, { allow: ['user'] });
  const entity = await catalog.getEntityByRef(req.params.ref, { credentials });

  const source = entity?.metadata.annotations?.[TODO_SOURCE_ANNOTATION];
  if (!source) {
    res.json({ items: [] });
    return;
  }

  const items = await todoList.listTodosForSource(source);
  res.json({ items });
});
```

The annotation is just a hint; the actual todo data still comes from your
plugin's own store. The catalog is the index, not the database.

### Surface the annotation on the entity page

On the frontend, use the standard helpers to check for the annotation before
showing your card. This keeps the UI clean for entities that have not opted
in:

```tsx
// plugins/todo/src/components/EntityTodoContent.tsx
import { useEntity } from '@backstage/plugin-catalog-react';
import { TODO_SOURCE_ANNOTATION } from '@internal/plugin-todo-common';

export const isTodoAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[TODO_SOURCE_ANNOTATION]);

export const EntityTodoContent = () => {
  const { entity } = useEntity();
  if (!isTodoAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={TODO_SOURCE_ANNOTATION} />;
  }
  return <TodoListForEntity entityRef={stringifyEntityRef(entity)} />;
};
```

`MissingAnnotationEmptyState` is the conventional way to nudge adopters
towards adding the annotation, and it links straight to your plugin's docs.

### Validate the annotation with a processor

If you want to fail fast when somebody types the annotation wrong, register
a catalog processor that validates it during ingestion. Processors run as
part of the catalog pipeline, so a bad annotation surfaces as a refresh error
on the entity rather than as a confusing empty state in the UI:

```ts
// plugins/catalog-backend-module-todo/src/TodoAnnotationProcessor.ts
import { CatalogProcessor } from '@backstage/plugin-catalog-node';
import { TODO_SOURCE_ANNOTATION } from '@internal/plugin-todo-common';

export class TodoAnnotationProcessor implements CatalogProcessor {
  getProcessorName() {
    return 'TodoAnnotationProcessor';
  }

  async preProcessEntity(entity: Entity) {
    const value = entity.metadata.annotations?.[TODO_SOURCE_ANNOTATION];
    if (value !== undefined && !/^[a-z0-9-/]+$/.test(value)) {
      throw new Error(
        `Invalid value for annotation ${TODO_SOURCE_ANNOTATION}: ${value}`,
      );
    }
    return entity;
  }
}
```

Wire the processor into a catalog backend module:

```ts
// plugins/catalog-backend-module-todo/src/module.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { TodoAnnotationProcessor } from './TodoAnnotationProcessor';

export const catalogModuleTodoAnnotation = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'todo-annotation',
  register(env) {
    env.registerInit({
      deps: { catalog: catalogProcessingExtensionPoint },
      async init({ catalog }) {
        catalog.addProcessor(new TodoAnnotationProcessor());
      },
    });
  },
});
```

Adopters install the module alongside the catalog backend, and the annotation
is now part of their ingestion pipeline.

## Custom TODO Entity Kind

Annotations are a good fit when todos belong to something else in the
catalog. When todos themselves are first-class objects — with their own
owners, lifecycles, and relations — model them as a new kind instead.

### Define the kind

Custom kinds live in a common package so they can be imported from frontend,
backend, and any code that writes a `catalog-info.yaml`. Define the entity
shape and a type guard:

```ts
// plugins/todo-common/src/TodoEntityV1alpha1.ts
import type { Entity } from '@backstage/catalog-model';

export interface TodoEntityV1alpha1 extends Entity {
  apiVersion: 'todo.backstage.io/v1alpha1';
  kind: 'Todo';
  spec: {
    owner: string;
    status: 'open' | 'in-progress' | 'done';
    dueDate?: string;
  };
}

export const isTodoEntity = (entity: Entity): entity is TodoEntityV1alpha1 =>
  entity.apiVersion === 'todo.backstage.io/v1alpha1' && entity.kind === 'Todo';
```

Pair the type with a JSON Schema. The schema is what the catalog uses to
reject malformed entries at ingestion time, and it is also what powers
auto-completion in `catalog-info.yaml` files:

```json
// plugins/todo-common/src/schema/Todo.v1alpha1.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["apiVersion", "kind", "metadata", "spec"],
  "properties": {
    "apiVersion": { "const": "todo.backstage.io/v1alpha1" },
    "kind": { "const": "Todo" },
    "spec": {
      "type": "object",
      "required": ["owner", "status"],
      "properties": {
        "owner": { "type": "string", "minLength": 1 },
        "status": { "enum": ["open", "in-progress", "done"] },
        "dueDate": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

### Register the kind with the catalog model

The catalog model extension point is how new kinds enter the validation
pipeline. Build a model layer that describes the kind, its versions, and the
relations it produces:

```ts
// plugins/todo-common/src/todoEntityModel.ts
import { createCatalogModelLayer } from '@backstage/catalog-model/alpha';
import todoJsonSchema from './schema/Todo.v1alpha1.schema.json';
import type { JsonObject } from '@backstage/types';

export const todoEntityModel = createCatalogModelLayer({
  layerId: 'todo.backstage.io/kind-todo',
  builder: model => {
    model.addKind({
      group: 'todo.backstage.io',
      names: { kind: 'Todo', singular: 'todo', plural: 'todos' },
      description: 'A unit of work tracked by the Todo plugin.',
      versions: [
        {
          name: 'v1alpha1',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['Group', 'User'],
            },
          ],
          schema: {
            jsonSchema: todoJsonSchema as JsonObject,
          },
        },
      ],
    });
  },
});
```

Wire the model layer into a catalog backend module so adopters can install it
with a one-line module reference:

```ts
// plugins/catalog-backend-module-todo/src/todoEntityModule.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { CatalogModelSources } from '@backstage/catalog-model/alpha';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { todoEntityModel } from '@internal/plugin-todo-common';

export const catalogModuleTodoEntityModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'todo-entity-model',
  register(env) {
    env.registerInit({
      deps: { model: catalogModelExtensionPoint },
      async init({ model }) {
        model.addModelSource(CatalogModelSources.static([todoEntityModel]));
      },
    });
  },
});
```

With the module installed, an adopter can drop a `catalog-info.yaml` into
their repository and have the catalog accept it as a `Todo`:

```yaml
apiVersion: todo.backstage.io/v1alpha1
kind: Todo
metadata:
  name: write-golden-path-docs
  description: Finish the integrations chapter of the golden path
spec:
  owner: group:default/platform
  status: in-progress
  dueDate: 2026-06-01T00:00:00Z
```

### Push todos in from your own backend

When the source of truth is your plugin's database rather than a YAML file in
a repo, expose the same entities through an entity provider. The catalog will
keep your provider's view in sync with everything else it knows about:

```ts
// plugins/catalog-backend-module-todo/src/TodoEntityProvider.ts
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import type { TodoListService } from './services';

export class TodoEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  constructor(
    private readonly todoList: TodoListService,
    private readonly scheduler: SchedulerService,
  ) {}

  getProviderName() {
    return 'todo-entity-provider';
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.scheduler.scheduleTask({
      id: 'todo-entity-provider-refresh',
      frequency: { minutes: 5 },
      timeout: { minutes: 2 },
      fn: () => this.refresh(),
    });
  }

  private async refresh() {
    if (!this.connection) return;
    const todos = await this.todoList.listTodos();

    await this.connection.applyMutation({
      type: 'full',
      entities: todos.map(todo => ({
        locationKey: `todo:${todo.id}`,
        entity: {
          apiVersion: 'todo.backstage.io/v1alpha1',
          kind: 'Todo',
          metadata: {
            name: todo.id,
            annotations: {
              'backstage.io/managed-by-location': `todo:${todo.id}`,
              'backstage.io/managed-by-origin-location': `todo:${todo.id}`,
            },
          },
          spec: {
            owner: todo.owner,
            status: todo.status,
            dueDate: todo.dueDate,
          },
        },
      })),
    });
  }
}
```

Register the provider via the catalog processing extension point:

```ts
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';

env.registerInit({
  deps: {
    catalog: catalogProcessingExtensionPoint,
    scheduler: coreServices.scheduler,
    todoList: todoListServiceRef,
  },
  async init({ catalog, scheduler, todoList }) {
    catalog.addEntityProvider(new TodoEntityProvider(todoList, scheduler));
  },
});
```

The `locationKey` is what ties an emitted entity back to the provider, so
deleting a todo in your backend cleanly removes it from the catalog on the
next refresh. The `managed-by-location` annotations tell adopters where a
given entity came from when they inspect it in the UI.

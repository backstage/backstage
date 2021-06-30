---
'@backstage/plugin-catalog-backend': minor
---

Handle entity name conflicts in a deterministic way and avoid crashes due to naming conflicts at startup.

This is a breaking change for the database and entity provider interfaces of the new catalog. The interfaces with breaking changes are `EntityProvider` and `ProcessingDatabase`, and while it's unlikely that these interfaces have much usage yet, a migration guide is provided below.

The breaking change to the `EntityProvider` interface lies within the items passed in the `EntityProviderMutation` type. Rather than passing along entities directly, they are now wrapped up in a `DeferredEntity` type, which is a tuple of an `entity` and a `locationKey`. The `entity` houses the entity as it was passed on before, while the `locationKey` is a new concept that is used for conflict resolution within the catalog.

The `locationKey` is an opaque string that should be unique for each location that an entity could be located at, and undefined if the entity does not have a fixed location. In practice it should be set to the serialized location reference if the entity is stored in Git, for example `https://github.com/backstage/backstage/blob/master/catalog-info.yaml`. A conflict between two entity definitions happen when they have the same entity reference, i.e. kind, namespace, and name. In the event of a conflict the location key will be used according to the following rules to resolve the conflict:

- If the entity is already present in the database but does not have a location key set, the new entity wins and will override the existing one.
- If the entity is already present in the database the new entity will only win if the location keys of the existing and new entity are the same.
- If the entity is not already present, insert the entity into the database along with the provided location key.

The breaking change to the `ProcessingDatabase` is similar to the one for the entity provider, as it reflects the switch from `Entity` to `DeferredEntity` in the `ReplaceUnprocessedEntitiesOptions`. In addition, the `addUnprocessedEntities` method has been removed from the `ProcessingDatabase` interface, and the `RefreshStateItem` and `UpdateProcessedEntityOptions` types have received a new optional `locationKey` property.

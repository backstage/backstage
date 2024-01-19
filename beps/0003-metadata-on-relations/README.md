---
title: BEP Title
status: provisional
authors:
  - '@sennyeya'
project-areas:
  - catalog
creation-date: yyyy-mm-dd
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Metadata on Relations

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

Metadata on relations is an important step forward to enabling more advanced use cases of the catalog's relational layer. While users will not be directly impacted by this update, plugin developers will be able to leverage this work for richer experiences. This BEP builds on decisions made during the last catalog rewrite, introduces a new way of defining annotations, and modifies some of the core catalog stitching loop.

## Glossary

- "Simple Relations": Relations defined as an entity reference, "kind:namespace/name".
- "Complex Relations": Relations with metadata.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

Metadata on relations has been an ask for a long time ([earliest comment](https://github.com/backstage/backstage/issues/1964#issuecomment-674246175) being late 2020). Currently, relations are limited to just a type name and a source and target entity. This enables a vast majority of use cases around denoting relationships in the software catalog but falls short for cases where relations _should_ store more metadata about the relationship. A few identified use cases are [environment specific metadata overrides](https://github.com/backstage/backstage/issues/11027) and [what API version a Component is using](https://github.com/backstage/backstage/issues/16389). By supporting metadata on relations (complex relations), we can enable these use cases.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

The goal of this BEP is to enable users to define metadata on relations for the purpose of adding additional information about the connection. Examples of this would be version of an API that your component depends on, the Kubernetes cluster ID your service depends on in DEV or the Grafana dashboard you use in STAGE. The consumption of this metadata will be client side.

In order to classify this BEP as a success, we expect the following to be implemented:

1. A new schema for defining relations that supports adding metadata.
1. The catalog is updated to ingest relations and their metadata successfully.
1. The catalog correctly de-duplicates annotations and their metadata.
1. There is a new client side way to access `metadata.annotation` keys.
1. The two tickets listed above, environment support and API versioning, are unblocked.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

Adding metadata to relations could have far reaching consequences for the catalog, to restrict this to a sane set of concerns we propose the following.

1. Implementing search of annotation metadata is outside of the scope of this BEP, the metadata that will be accessed will be accessed as part of the entity definition and not queried separately.
1. Updating the catalog ingestion cycle to use an array of metadata not just a single metadata. Metadata on annotation will be used to overwrite metadata on Entities client-side. If that data is something preprocessed by a `Processor`/`Provider`, that processor will need to process _all_ relation metadata overwrites. This is a significant shift in thinking around the ingestion loop and for this BEP will not be considered.
1. Updating individual plugins to support the above is out of scope of this BEP.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

This work has 3 parts,

1. Defining and implementing a schema / import layer for relations with metadata.
1. Storing and processing relations with metadata.
1. Accessing relations with metadata on the clientside.

### Schema / import layer

As a `catalog-info.yaml`, I should be able to continue defining annotations with the simple schema that exists currently.

We propose adding a more complex schema that can be interchanged as needed to allow more complex annotations that have attached metadata.

### Storage and processing

As an `catalog-info.yaml` writer, I should be able to continue to use their simple annotations as well as start to use complex annotations along side them.

We propose overriding the existing annotation type to support metadata and adding support for these new annotations in the entity stitching cycle.

Open questions:

- Is metadata on relations single directional or bidirectional?

### Clientside access

As a plugin developer, I should be able to easily get access to entity metadata as well as context relevant overrides.

We propose a simple API for this and recommendations for implementations that may use these context relevant overrides.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

### Schema / Import Layer

To start, we propose the following as the new relation format,

```ts
export type ComplexEntityRelationReference = {
  targetRef: string;
  metadata: EntityMeta;
};

export type RelationReference =
  // The existing approach to defining relations.
  string | ComplexEntityRelationReference;
```

This could then be used like so,

```yaml
providesApis:
  - targetRef: wayback-search
    metadata:
      annotations:
        backstage.io/version: '1'
  - wayback-ingestor
```

This allows users to provide _both_ the simple and complex schema.

#### Using `EntityMeta` for relational metadata definition

There are two approaches we could take here, the first is restrict this to a subset of keys based on the use cases I've outlined above and the second is to design with the intention to support a wide range of keys and let plugin developers decide what/how to pull in data. Although the first is more focused, we propose that the second opens more use cases that may not be explored as part of this document and allows adopters a wider range of options to break out of the base model.

In doing so, we will need to provide strong recommendations on what relational metadata means, how it's used and support for it. Users need to have a clear understanding of what they're customizing should they go down that path.

#### Updates to `EntityRelation`

```ts
export type EntityRelation = {
  type: string;
  targetRef: string;

  /**
   * New property. We'll choose annotations right now to simplify the problem.
   */
  metadata?: EntityMeta;
};
```

Updates the object to match the above ingestion updates.

### Storage and processing of relational metadata

#### Ingestion

By updating the type as seen in [`EntityRelation`](#updates-to-entityrelation), we will get automatic type updates to the `processingResult.relation` interface. This will be updated to now include an optional `metadata` property.

Users that want to update their ingestors to support complex relations will have to add a processing layer before ingesting relations like so,

```ts
function parseRelation(
  relation: RelationReference,
): ComplexEntityRelationReference {
  if (typeof relation === 'string') {
    return { targetRef: relation };
  }
  return relation;
}

function parseRelationArray(arr: RelationReference[]) {
  return arr?.map(parseRelation);
}

const convertedTargets = Array.isArray(targets)
  ? parseRelationArray(targets)
  : parseRelation(targets);
for (const target of [convertedTargets].flat()) {
  const targetRef = parseEntityRef(target.targetRef, context);
  ...
}
```

This will standardize all of your relations to the new `RelationReference` interface and allow easy use of `processingResult.relation`. If you're using `processingResult.relation`, you are already transforming to `EntityRelation` which has significant overlap with `RelationReference`.

#### Bidirectional Metadata

We propose that metadata on relations should be bidirectional by default. The use cases outlined above would all benefit from having metadata on both side of the relation to support queries in both directions.

1. API version on a `consumesApi` relation from a Component to API would allow a user to go from Component to a specific API at a specific version. It would also allow for a page of current API versions and the Components that use them.
1. Environment overrides on a `deploysTo` relation from Component to Environment would allow a user to see environment specific ops data in their plugin. It would also allow the environment to show the most common overrides and recommend consolidations or saving opportunities.

Without bidirectional metadata, this would require a second query to grab all related entities and their relational metadata.

There is a little confusion about wording here. If we were to attach version to `consumesApi` and it was attached to `apiConsumedBy` during ingestion as well, does this imply that the Component now has versions? We would hope not! We expect this to be a recurring question once this gets released. We could go down the road of unidirectional metadata on relations, but again there's ambiguity there.

#### Storage

We propose adding a new `text` column to `relations` mirroring `final_entity` on `entities`. This will store a JSON string of the metadata. As part of this new column addition, we'll have to add this metadata to the database like so,

```diff name="plugins/catalog-backend/src/database/DefaultProcessingDatabase.ts"
    // Batch insert new relations
    const relationRows: DbRelationsRow[] = relations.map(
-      ({ source, target, type }) => ({
+      ({ source, target, type, metadata }) => ({
        originating_entity_id: id,
        source_entity_ref: stringifyEntityRef(source),
        target_entity_ref: stringifyEntityRef(target),
        type,
+        metadata: metadata ? JSON.stringify(metadata) : undefined,
      }),
    }),
    );
```

#### Stitching / Processing

In order for relational metadata to show up on relations, we'll need to add the metadata to the query, [here](https://github.com/backstage/backstage/blob/patch/v1.22.0/plugins/catalog-backend/src/database/operations/stitcher/performStitching.ts#L103-L107) to be

```diff
knex
      .distinct({
        relationType: 'type',
        relationTarget: 'target_entity_ref',
      })
+      .select('metadata')
      .from('relations')
```

We also need to add the metadata to the relations that get attached to the entity, [here](https://github.com/backstage/backstage/blob/patch/v1.22.0/plugins/catalog-backend/src/database/operations/stitcher/performStitching.ts#L178-L189), like so,

```diff
entity.relations = relationsResult
    .filter(row => row.relationType /* exclude null row, if relevant */)
    .map<EntityRelation>(row => ({
      type: row.relationType!,
      targetRef: row.relationTarget!,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    }))
```

#### De-duplication

The catalog already has a basic de-duplication measure for relations, found [here](https://github.com/backstage/backstage/blob/patch/v1.22.0/plugins/catalog-backend/src/database/DefaultProcessingDatabase.ts#L300-L305). We propose that entries should be merged and then deduplicated. The below illustrates that algorithm,

```ts
class DefaultProcessingDatabase {
  ...
  private deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
    const map = new Map();
    for(const row of rows){
      const key = `${row.source_entity_ref}:${row.target_entity_ref}:${row.type}`;
      if(!map.has(key)){
        map.set(key, {});
      }
      const mergedHydratedValues = _.merge(map.get(key), {
        ...relation,
        metadata: relation.metadata ? JSON.parse(relation.metadata) : undefined,
      });

      map.set(key, mergedHydratedValue);
    }

    return map.values().map(e=>({
      ...e,
      metadata: e.metadata ? JSON.stringify(e.metadata) : undefined,
    }));
  }
}
```

### Clientside access

<!--
This is less flushed out and definitely needs feedback/iteration.
-->

We propose the creation of a new frontend API for accessing entity metadata with context,

```ts
const EntityFieldResolverContext = createContext<{
  resolver: (entity: Entity, field: string) => string;
}>({
  resolver: (entity, field) => _.get(entity, field),
});

const useEntityMetadata = (entity: Entity, field: string) => {
  const { resolvers } = useContext(EntityFieldResolverContext);
  return resolvers.resolve(entity, field);
};
```

Separate pages could override this context for specific use cases. An environment use case could provide a `EnvironmentEntityFieldResolverContext` that resolves field overrides based on metadata on relations attached between a selected environment and the current Component you're looking at.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

As proposed above, the change to the model will be a backwards compatible change. The additional property will be optional and any data stored will be optional as well. Rolling back this change will cause loss of data in the database, but it can be replicated through the ingestion cycle when upgrading.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->

- Supplying override data on the Component itself.
- Relations as separate objects
-

## 1. Supplying override data on the Component itself.

This approach would look something like,

```yaml
kind: Component
spec:
  environmentOverrides:
    production:
      annotations:
        sentry-id: prod-id
    development:
      annotations:
        sentry-id: dev-id
```

The primary downside of this approach is that this is a fragile API that doesn't scale well to additional use cases. There's no easy way to add a new override for an entirely different context. Either you have to start nesting keys,

```yaml
overrides:
  environment:
    production: ...
  otherOverride:
    key1: ...
```

or you have to start defining top level keys,

```yaml
environmentOverrides:
  production: ...
otherOverride:
  key1: ...
```

And both of those don't scale well with complexity. We also have the connection between the two entities we care about, and in all cases there are multiple entities involved. That connection should contain the data, not an entity participating in that connection.

### 2. Relations (with metadata) as separate objects

This is something that was floated as part of [#1964](https://github.com/backstage/backstage/issues/1964) as well as came up in [the Environment kind PRFC](https://github.com/backstage/backstage/pull/21560#issuecomment-1826217370). The idea being that because these relations are starting to resemble entities with metadata, that they should be stored as such in that catalog instead of us just attaching metadata to them and keeping them as relations. This is a more common pattern in Kubernetes and not something we've seen in Backstage. `@Rugvip`'s comment there is still relevant,

> The suggested solution also doesn't model relations as standalone entities. This is primarily due to the overhead of this approach, especially since we'd likely end up having to name each relation individually. It may make sense for some larger and more complex relations as separate entities though, and could be combined with the suggestion in this RFC. It does feel very overkill for relations like owner and dependency though.
> I'm also a bit worried that modelling relations as entities may cause confusion as they extend the existing entity model. What are for example the role of labels in relation entities, would you query for a set of relations using a label query? ^\_> It's also not as clear how to map that model to GraphQL IMO.

Not only would relations as entities introduce a bunch of complexity to the catalog, but it would still be overkill for our use case. We would argue that `consumesApi` and `deploysTo` are not much different than `ownerOf` or `dependencyOf`.

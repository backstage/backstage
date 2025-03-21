---
id: extending-the-model--old
title: Extending the model
# prettier-ignore
description: Documentation on extending the catalog model
---

The Backstage catalog [entity data model](descriptor-format.md) is based on the
[Kubernetes objects format](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/),
and borrows a lot of its semantics as well. This page describes those semantics
at a higher level and how to extend them to fit your organization.

Backstage comes with a number of catalog concepts out of the box:

- There are a number of builtin versioned _kinds_, such as `Component`, `User`
  etc. These encapsulate the high level concept of an entity, and define the
  schema for its entity definition data.
- An entity has both a _metadata_ object and a _spec_ object at the root.
- Each kind may or may not have a _type_. For example, there are several well
  known types of component, such as `service` and `website`. These clarify the
  more detailed nature of the entity, and may affect what features are exposed
  in the interface.
- Entities may have a number of _[annotations](well-known-annotations.md)_ on
  them. These can be added either by humans into the descriptor files, or added
  by automated processes when the entity is ingested into the catalog.
- Entities may have a number of _labels_ on them.
- Entities may have a number of _relations_, expressing how they relate to each
  other in different ways.

We'll list different possibilities for extending this below.

## Adding a New apiVersion of an Existing Kind

Example intents:

> "I want to evolve this core kind, tweaking the semantics a bit so I will bump
> the apiVersion a step"

> "This core kind is a decent fit but we want to evolve it at will so we'll move
> it to our own company's apiVersion space and use that instead of
> `backstage.io`."

The `backstage.io` apiVersion space is reserved for use by the Backstage
maintainers. Please do not change or add versions within that space.

If you add an [apiVersion](descriptor-format.md#apiversion-and-kind-required)
space of your own, you are effectively branching out from the underlying kind
and making your own. An entity kind is identified by the apiVersion + kind pair,
so even though the resulting entity may be similar to the core one, there will
be no guarantees that plugins will be able to parse or understand its data. See
below about adding a new kind.

## Adding a New Kind

Example intents:

> "The kinds that come with the package are lacking. I want to model this other
> thing that is a poor fit for either of the builtins."

> "This core kind is a decent fit but we want to evolve it at will so we'll move
> it to our own company's apiVersion space and use that instead of
> `backstage.io`."

A [kind](descriptor-format.md#apiversion-and-kind-required) is an overarching
family, or an idea if you will, of entities that also share a schema. Backstage
comes with a number of builtin ones that we believe are useful for a large
variety of needs that one may want to model in Backstage. The primary ambition
is to map things to these kinds, but sometimes you may want or need to extend
beyond them.

Introducing a new apiVersion is basically the same as adding a new kind. Bear in
mind that most plugins will be compiled against the builtin
`@backstage/catalog-model` package and have expectations that kinds align with
that.

The catalog backend itself, from a storage and API standpoint, does not care
about the kind of entities it stores. Extending with new kinds is mainly a
matter of permitting them to pass validation when building the backend catalog
using the `CatalogBuilder`, and then to make plugins be able to understand the
new kind.

For the consuming side, it's a different story. Adding a kind has a very large
impact. The very foundation of Backstage is to attach behavior and views and
functionality to entities that we ascribe some meaning to. There will be many
places where code checks `if (kind === 'X')` for some hard coded `X`, and casts
it to a concrete type that it imported from a package such as
`@backstage/catalog-model`.

If you want to model something that doesn't feel like a fit for either of the
builtin kinds, feel free to reach out to the Backstage maintainers to discuss
how to best proceed.

If you end up adding that new kind, you must namespace its `apiVersion`
accordingly with a prefix that makes sense, typically based on your organization
name - e.g. `my-company.net/v1`. Also do pick a new `kind` identifier that does
not collide with the builtin kinds.

## Adding a New Type of an Existing Kind

Example intents:

> "This is clearly a component, but it's of a type that doesn't quite fit with
> the ones I've seen before."

> "We don't call our teams "team", can't we put "flock" as the group type?"

Some entity kinds have a `type` field in its spec. This is where an organization
are free to express the variety of entities within a kind. This field is
expected to follow some taxonomy that makes sense for yourself. The chosen value
may affect what operations and views are enabled in Backstage for that entity.
Inside Spotify our model has grown significantly over the years, and our
component types now include ML models, apps, data pipelines and many more.

It might be tempting to put software that doesn't fit into any of the existing
types into an Other catch-all type. There are a few reasons why we advise
against this; firstly, we have found that it is preferred to match the
conceptual model that your engineers have when describing your software.
Secondly, Backstage helps your engineers manage their software by integrating
the infrastructure tooling through plugins. Different plugins are used for
managing different types of components.

For example, the
[Lighthouse plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/lighthouse/plugins/lighthouse)
only makes sense for Websites. The more specific you can be in how you model
your software, the easier it is to provide plugins that are contextual.

Adding a new type takes relatively little effort and carries little risk. Any
type value is accepted by the catalog backend, but plugins may have to be
updated if you want particular behaviors attached to that new type.

## Changing the Validation Rules for The Entity Envelope or Metadata Fields

Example intents:

> "We want to import our old catalog but the default set of allowed characters
> for a metadata.name are too strict."

> "I want to change the rules for annotations so that I'm allowed to store any
> data in annotation values, not just strings."

After pieces of raw entity data have been read from a location, they are passed
through a field format validation step. This ensures that the types and syntax
of the base envelope and metadata make sense - in short, things that aren't
entity-kind-specific. Some or all of these validators can be replaced when
building the backend using the catalog's dedicated `catalogModelExtensionPoint`
(or directly on the `CatalogBuilder` if you are still using the old backend
system).

The risk and impact of this type of extension varies, based on what it is that
you want to do. For example, extending the valid character set for kinds,
namespaces and names can be fairly harmless, with a few notable exceptions -
there is code that expects these to never ever contain a colon or slash, for
example, and introducing URL-unsafe characters risks breaking plugins that
aren't careful about encoding arguments. Supporting non-strings in annotations
may be possible but has not yet been tried out in the real world - there is
likely to be some level of plugin breakage that can be hard to predict.

You must also be careful about not making the rules _more strict_ than they used
to be after populating the catalog with data. This risks making previously valid
entities start having processing errors and fail to update.

Before making this kind of extension, we recommend that you contact the
Backstage maintainers or a support partner to discuss your use case.

This is an example of relaxing the format rules of the `metadata.name` field:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

const myCatalogCustomizations = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'catalog-customization',
  register(reg) {
    reg.registerInit({
      deps: {
        catalogModel: catalogModelExtensionPoint,
      },
      async init({ catalogModel }) {
        catalogModel.setFieldValidators({
          // This is only one of many methods that you can pass into
          // setFieldValidators; your editor of choice should help you
          // find the others. The length checks and regexp inside are
          // just examples and can be adjusted as needed, but take care
          // to test your changes thoroughly to ensure that you get
          // them right.
          isValidEntityName(value) {
            return (
              typeof value === 'string' &&
              value.length >= 1 &&
              value.length <= 63 &&
              /^[A-Za-z0-9@+_.-]+$/.test(value)
            );
          },
        });
      },
    });
  },
});

const backend = createBackend();
// ... add other backend features and the catalog backend itself here ...
backend.add(myCatalogCustomizations);
backend.start();
```

## Changing the Validation Rules for Core Entity Fields

Example intent:

> "I don't like that the owner is mandatory. I'd like it to be optional."

After reading and policy-checked entity data from a location, it is sent through
the processor chain looking for processors that implement the
`validateEntityKind` step, to see that the data is of a known kind and abides by
its schema. There is a builtin processor that implements this for all known core
kinds and matches the data against their fixed validation schema. This processor
can be replaced when building the backend catalog using the `CatalogBuilder`,
with a processor of your own that validates the data differently.
This replacement processor must have a name that matches the builtin processor, `BuiltinKindsEntityProcessor`.

This type of extension is high risk, and may have high impact across the
ecosystem depending on the type of change that is made. It is therefore not
recommended in normal cases. There will be a large number of plugins and
processors - and even the core itself - that make assumptions about the shape of
the data and import the typescript data type from the `@backstage/catalog-model`
package.

## Adding New Fields to the Metadata Object

Example intent:

> "Our entities have this auxiliary property that I would like to express for
> several entity kinds and it doesn't really fit as a spec field."

The metadata object is currently left open for extension. Any unknown fields
found in the metadata will just be stored verbatim in the catalog. However we
want to caution against extending the metadata excessively. Firstly, you run the
risk of colliding with future extensions to the model. Secondly, it is common
that this type of extension lives more comfortably elsewhere - primarily in the
metadata labels or annotations, but sometimes you even may want to make a new
component type or similar instead.

There are some situations where metadata can be the right place. If you feel
that you have run into such a case and that it would apply to others, do feel
free to contact the Backstage maintainers or a support partner to discuss your
use case. Maybe we can extend the core model to benefit both you and others.

## Adding New Fields to the Spec Object of an Existing Kind

Example intent:

> "The builtin Component kind is fine but we want to add an additional field to
> the spec for describing whether it's in prod or staging."

A kind's schema validation typically doesn't forbid "unknown" fields in an
entity `spec`, and the catalog will happily store whatever is in it. So doing
this will usually work from the catalog's point of view.

Adding fields like this is subject to the same risks as mentioned about metadata
extensions above. Firstly, you run the risk of colliding with future extensions
to the model. Secondly, it is common that this type of extension lives more
comfortably elsewhere - primarily in the metadata labels or annotations, but
sometimes you even may want to make a new component type or similar instead.

There are some situations where the spec can be the right place. If you feel
that you have run into such a case and that it would apply to others, do feel
free to contact the Backstage maintainers or a support partner to discuss your
use case. Maybe we can extend the core model to benefit both you and others.

## Adding a New Annotation

Example intents:

> "Our custom made build system has the concept of a named pipeline-set, and we
> want to associate individual components with their corresponding pipeline-sets
> so we can show their build status."

> "We have an alerting system that automatically monitors service health, and
> there's this integration key that binds the service to an alerts pool. We want
> to be able to show the ongoing alerts for our services in Backstage so it'd be
> nice to attach that integration key to the entity somehow."

Annotations are mainly intended to be consumed by plugins, for feature detection
or linking into external systems. Sometimes they are added by humans, but often
they are automatically generated at ingestion time by processors. There is a set
of [well-known annotations](well-known-annotations.md), but you are free to add
additional ones. This carries no risk or impact to other systems as long as you
abide by the following naming rules.

- The `backstage.io` annotation prefix is reserved for use by the Backstage
  maintainers. Reach out to us if you feel that you would like to make an
  addition to that prefix.
- Annotations that pertain to a well known third party system should ideally be
  prefixed with a domain, in a way that makes sense to a reader and connects it
  clearly to the system (or the maker of the system). For example, you might use
  a `pagerduty.com` prefix for pagerduty related annotations, but maybe not
  `ldap.com` for LDAP annotations since it's not directly affiliated with or
  owned by an LDAP foundation/company/similar.
- Annotations that have no prefix at all, are considered local to your Backstage
  instance and can be used freely as such, but you should not make use of them
  outside of your organization. For example, if you were to open source a plugin
  that generates or consumes annotations, then those annotations must be
  properly prefixed with your company domain or a domain that pertains to the
  annotation at hand.

## Adding a New Label

Example intents:

> "Our process reaping system wants to periodically scrape for components that
> have a certain property."

> "It'd be nice if our service owners could just tag their components somehow to
> let the CD system know to automatically generate SRV records or not for that
> service."

Labels are mainly intended to be used for filtering of entities, by external
systems that want to find entities that have some certain property. This is
sometimes used for feature detection / selection. An example could be to add a
label `deployments.my-company.net/register-srv: "true"`.

At the time of writing this, the use of labels is very limited and we are still
settling together with the community on how to best use them. If you feel that
your use case fits the labels best, we would appreciate if you let the Backstage
maintainers know.

You are free to add labels. This carries no risk or impact to other systems as
long as you abide by the following naming rules.

- The `backstage.io` label prefix is reserved for use by the Backstage
  maintainers. Reach out to us if you feel that you would like to make an
  addition to that prefix.
- Labels that pertain to a well known third party system should ideally be
  prefixed with a domain, in a way that makes sense to a reader and connects it
  clearly to the system (or the maker of the system). For example, you might use
  a `pagerduty.com` prefix for pagerduty related labels, but maybe not
  `ldap.com` for LDAP labels since it's not directly affiliated with or owned by
  an LDAP foundation/company/similar.
- Labels that have no prefix at all, are considered local to your Backstage
  instance and can be used freely as such, but you should not make use of them
  outside of your organization. For example, if you were to open source a plugin
  that generates or consumes labels, then those labels must be properly prefixed
  with your company domain or a domain that pertains to the label at hand.

## Adding a New Relation Type

Example intents:

> "We have this concept of service maintainership, separate from ownership, that
> we would like to make relations to individual users for."

> "We feel that we want to explicitly model the team-to-global-department
> mapping as a relation, because it is core to our org setup and we frequently
> query for it."

Any processor can emit relations for entities as they are being processed, and
new processors can be added when building the backend catalog using the
`CatalogBuilder`. They can emit relations based on the entity data itself, or
based on information gathered from elsewhere. Relations are directed and go from
a source entity to a target entity. They are also tied to the entity that
originated them - the one that was subject to processing when the relation was
emitted. Relations may be dangling (referencing something that does not actually
exist by that name in the catalog), and callers need to be aware of that.

There is a set of [well-known relations](well-known-relations.md), but you are
free to emit your own as well. You cannot change the fact that they are directed
and have a source and target that have to be an
[entity reference](references.md), but you can invent your own types. You do not
have to make any changes to the catalog backend in order to accept new relation
types.

At the time of writing this, we do not have any namespacing/prefixing scheme for
relation types. The type is also not validated to contain only some particular
set of characters. Until rules for this are settled, you should stick to using
only letters, dashes and digits, and to avoid collisions with future core
relation types, you may want to prefix the type somehow. For example:
`myCompany-maintainerOf` + `myCompany-maintainedBy`.

If you have a suggestion for a relation type to be elevated to the core
offering, reach out to the Backstage maintainers or a support partner.

## Using a Well-Known Relation Type for a New Purpose

Example intents:

> "The ownerOf/ownedBy relation types sound like a good fit for expressing how
> users are technical owners of our company specific ServiceAccount kind, and we
> want to reuse those relation types for that."

At the time of writing, this is uncharted territory. If the documented use of a
relation states that one end of the relation commonly is a User or a Group, for
example, then consumers are likely to have conditional statements on the form
`if (x.kind === 'User') {} else {}`, which get confused when an unexpected kind
appears.

If you want to extend the use of an established relation type in a way that has
an effect outside of your organization, reach out to the Backstage maintainers
or a support partner to discuss risk/impact. It may even be that one end of the
relation could be considered for addition to the core.

## Adding a New Status field

Example intent:

> "We would like to convey entity statuses through the catalog in a generic way,
> as an integration layer. Our monitoring and alerting system has a plugin with
> Backstage, and it would be useful if the entity's status field contained the
> current alert state close to the actual entity data for anyone to consume. We
> find the `status.items` semantics a poor fit, so we would prefer to make our
> own custom field under `status` for these purposes."

We have not yet ventured to define any generic semantics for the `status`
object. We recommend sticking with the `status.items` mechanism where possible
(see below), since third party consumers will not be able to consume your status
information otherwise. Please reach out to the maintainers on Discord or by
making a GitHub issue describing your use case if you are interested in this
topic.

## Adding a New Status Item Type

Example intent:

> "The semantics of the entity `status.items` field are fine for our needs, but
> we want to contribute our own type of status into that array instead of the
> catalog specific one."

This is a simple, low risk way of adding your own status information to
entities. Consumers will be able to easily track and display the status together
with other types / sources.

We recommend that any status type that are not strictly private within the
organization be namespaced to avoid collisions. Statuses emitted by Backstage
core processes will for example be prefixed with `backstage.io/`, your
organization may prefix with `my-org.net/`, and `pagerduty.com/active-alerts`
could be a sensible complete status item type for that particular external
system.

The mechanics for how to emit custom statuses is not in place yet, so if this is
of interest to you, you might consider contacting the maintainers on Discord or
my making a GitHub issue describing your use case.
[This issue](https://github.com/backstage/backstage/issues/2292) also contains
more context.

## Referencing different environments with the model

Example intent:

> "I have multiple versions of my API deployed in different environments so I
> want to have `mytool-dev` and `mytool-prod` as different entities."

While it's possible to have different versions of the same thing represented as
separate entities, it's something we generally recommend against. We believe
that a developer should be able to just find for example one `Component`
representing a service, and to be able to see the different code versions that
are deployed throughout your stack within its view. This reasoning works
similarly for other kinds as well, such as `API`.

That being said - sometimes the differences between versions are so large, that
they represent what is for all intents and purposes an entirely new entity as
seen from the consumer's point of view. This can happen for example for
different _significant_ major versions of an API, and in particular if the two
major versions coexist in the ecosystem for some time. In those cases, it can be
motivated to have one `my-api-v2` and one `my-api-v3` named entity. This matches
the end user's expectations when searching for the API, and matches the desire
to maybe have separate documentation for the two and similar. But use this
sparingly - only do it if the extra modelling burden is outweighed by any
potential better clarity for users.

When writing your custom plugins, we encourage designing them such that they can
show all the different variations through environments etc under one canonical
reference to your software in the catalog. For example for a continuous
deployment plugin, a user is likely to be greatly helped by being able to see
the entity's versions deployed in all different environments next to each other
in one view. That is also where they might be offered the ability to promote
from one environment to the other, do rollbacks, see their relative performance
metrics, and similar. This coherency and collection of tooling in one place is
where something like Backstage can offer the most value and effectiveness of
use. Splitting your entities apart into small islands makes this harder.

## Implementing custom model extensions

This section walks you through the steps involved extending the catalog model
with a new Entity type.

### Creating a custom entity definition

The first step of introducing a custom entity is to define what shape and schema
it has. We do this using a TypeScript type, as well as a JSONSchema schema.

Most of the time you will want to have at least the TypeScript type of your
extension available in both frontend and backend code, which means you likely
want to have an isomorphic package that houses these types. Within the Backstage
main repo the package naming pattern of `<plugin>-common` is used for isomorphic
packages, and you may choose to adopt this pattern as well.

You can generate an isomorphic plugin package by running: `yarn new` and then
select "plugin-common" from the list of options

There's at this point no existing templates for generating isomorphic plugins
using the `@backstage/cli`. Perhaps the simplest way to get started right now is
to copy the contents of one of the existing packages in the main repository,
such as `plugins/scaffolder-common`, and rename the folder and file contents to
the desired name. This example uses _foobar_ as the plugin name so the plugin
will be named _foobar-common_.

Once you have a common package in place you can start adding your own entity
definitions. For the exact details on how to do that we defer to getting
inspired by the existing
[scaffolder-common](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-common/src/index.ts)
package. But in short you will need to declare a TypeScript type and a
JSONSchema for the new entity kind.

### Building a custom processor for the entity

The next step is to create a custom processor for your new entity kind. This
will be used within the catalog to make sure that it's able to ingest and
validate entities of our new kind. Just like with the definition package, you
can find inspiration in for example the existing
[ScaffolderEntitiesProcessor](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-scaffolder-entity-model/src/processor/ScaffolderEntitiesProcessor.ts).
We also provide a high-level example of what a catalog process for a custom
entity might look like:

```ts
import { CatalogProcessor, CatalogProcessorEmit, processingResult } from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common'
import { Entity, entityKindSchemaValidator } from '@backstage/catalog-model';

// For an example of the JSONSchema format and how to use $ref markers to the
// base definitions, see:
// https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema/kinds/Component.v1alpha1.schema.json
import { foobarEntityV1alpha1Schema } from '@internal/catalog-model';

export class FoobarEntitiesProcessor implements CatalogProcessor {
  // You often end up wanting to support multiple versions of your kind as you
  // iterate on the definition, so we keep each version inside this array as a
  // convenient pattern.
  private readonly validators = [
    // This is where we use the JSONSchema that we export from our isomorphic
    // package
    entityKindSchemaValidator(foobarEntityV1alpha1Schema),
  ];

  // Return processor name
  getProcessorName(): string {
    return 'FoobarEntitiesProcessor'
  }

  // validateEntityKind is responsible for signaling to the catalog processing
  // engine that this entity is valid and should therefore be submitted for
  // further processing.
  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      // If the validator throws an exception, the entity will be marked as
      // invalid.
      if (validator(entity)) {
        return true;
      }
    }

    // Returning false signals that we don't know what this is, passing the
    // responsibility to other processors to try to validate it instead.
    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    if (
      entity.apiVersion === 'example.com/v1alpha1' &&
      entity.kind === 'Foobar'
    ) {
      const foobarEntity = entity as FoobarEntityV1alpha1;

      // Typically you will want to emit any relations associated with the
      // entity here.
      emit(processingResult.relation({ ... }))
    }

    return entity;
  }
}
```

Once the processor is created it can be wired up to the catalog via the
`CatalogBuilder` in `packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { FoobarEntitiesProcessor } from '@internal/plugin-foobar-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  /* highlight-add-next-line */
  builder.addProcessor(new FoobarEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  // ..
}
```

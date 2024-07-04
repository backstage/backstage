---
title: Complex Catalog Queries
status: provisional
authors:
  - '@freben'
owners:
  - '@backstage/catalog-maintainers'
project-areas:
  - catalog
creation-date: 2024-07-02
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Complex Catalog Queries

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

This BEP proposes a new extensible tree structured query/filter format for the catalog client and server, that allows for clearer and more complex filtering to be performed.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

The catalog currently supports two query methods when listing entities:

- [The "filter" matcher](https://backstage.io/docs/features/software-catalog/software-catalog-api#filtering) which connects path-like keys with exact values, and
- [The "full text" matcher](https://backstage.io/docs/features/software-catalog/software-catalog-api#full-text-filtering) which can match on parts of multiple fields at a time.

In particular the former is limited, very opaque and hard to learn, and has several shortcomings. The [documentation](https://backstage.io/docs/features/software-catalog/software-catalog-api) carefully tries to describe the complex nuances of the implicit `AND`/`OR` structure, how arrays are flattened, how existence checks differ from value checks, how the on-wire HTTP query serialization is different from the catalog client form, etc. Adding more features to this form is almost impossible without digging even further into the limitations it already suffers from.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

- Queries are JSON like in structure for easy serialization
- Queries can be written by hand with ease with type completion in code editors, and can be understood by a human at a glance
- Support nested logical expressions, specifically the `AND`, `OR`, and `NOT` operators
- Keep supporting both the "filter" and the "full text" matchers, as parts of the (possibly nested) query
- The query format can easily be extended with more operators and matchers in the future, without changing the overall syntax
- The query format is user facing with TypeScript types and passed into e.g. the catalog client library by callers, as well as acting as the on-wire format sent to the catalog backend, without intermediate transformation
- Retain compatibility with pagination schemes, as used e.g. by `/entities/by-query`

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

Inventing new matchers is not part of this BEP. Specifically, there have been asks for substring matching (for example by inserting percent signs in values as in SQL), and it is tempting to make more expressive matchers for example for relations. But those should be addressed in a separate BEP or feature request to avoid stalling this BEP on such design details. Adding them should be easy - later.

Likewise, this BEP does not propose a design for a text based form of this query method, for example the ability to write something along the lines of `NOT (metadata.name = 'daisy' OR (...` as a string. This is a tangentially related need, for example where a string based filter could be passed to entity card extensions in the new frontend system to decide when to show them or not. But that should be handled in a separate BEP or feature request, and those string forms should be possible to translate to the JSON like form of this BEP internally.

No particular emphasis is placed on making the query format efficient to parse. Where possible, user convenience and readability is prioritized.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

Add a set of recursive TypeScript types to the `@backstage/catalog-client` package that represent the basic query structure. This allows for code completion and documenting the query expressions.

For those catalog client calls that accepted a `filter` parameter, add a `query` parameter of the above form. This sends the query verbatim across the wire to the server.

In the catalog service, parse and translate these queries to the already existing `EntityFilter` type form.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

Suggested TypeScript expression of the query type:

```ts
export type EntityQueryLogicalOperator =
  | { allOf: EntityQuery[] } // logical AND
  | { anyOf: EntityQuery[] } // logical OR
  | { not: EntityQuery }; // logical NOT

export type EnityQueryMatcher =
  | {
      keyExists: string;
    }
  | {
      keyEquals: {
        key: string;
        value: string;
      };
    };

export type EntityQuery = EntityQueryLogicalOperator | EntityQueryMatcher;
```

The example in [the API docs](https://backstage.io/docs/features/software-catalog/software-catalog-api/#filtering) describes what is encoded on the wire as `filter=kind=user,metadata.namespace=default&filter=kind=group,spec.type`. In the new query format, it would be:

```ts
{
  oneOf: [
    {
      allOf: [
        { keyEquals: { key: 'kind', value: 'group' } },
        { keyEquals: { key: 'metadata.namespace', value: 'default' } },
      ],
    },
    {
      allOf: [
        { keyEquals: { key: 'kind', value: 'group' } },
        { keyExists: 'spec.type' },
        // ...or
        { key: 'kind', op: '=', value: 'group' },
        { key: 'spec.type', op: 'exists' },
        // ...or
        { eq: [{ key: 'kind' }, 'group'] },
        { exists: [{ key: 'spec.type' }]},
        // ...or
        [{ key: 'kind' }, '=' 'group'],
        [{ key: 'spec.type' }, 'exists'],
      ],
    },
  ];
}
```

This is what is sent over the wire, and is very similar to the structure that feeds the internal database engine of the catalog as well.

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

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

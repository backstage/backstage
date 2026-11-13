---
title: Catalog History and Events
status: implementable
authors:
  - '@freben'
owners:
  - '@backstage/catalog-maintainers'
project-areas:
  - catalog
  - events
creation-date: 2025-06-03
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed
-->

# Catalog History and Events: <!-- Your short, descriptive title -->

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

This BEP proposes giving the software catalog the ability to internally track the history of changes to its state (for example, entities changing or being deleted). And then, to expose those changes both via a REST API and through the events system. This will open up for building realtime/reactive consumption patterns of the catalog, including replicating (all or parts of) its state, instead of requiring polling. It also lets operators and entity owners dig into the historical state of the catalog, understanding causes and effects over time.

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

The [Catalog Event Stream Endpoint RFC](https://github.com/backstage/backstage/issues/8219) is one of the oldest issues still around in the project and has received a lot of feedback. It contains some discussion and motivation on this topic, but I'll list some here as well:

- Consumers currently have no choice but to use periodic polling to stay up to date with the catalog. This is expensive, and introduces delays before reaching consistency. Having access to event driven mechanisms for staying up to date can mean cheaper, faster updates in external systems as an effect of catalog changes. The catalog itself already benefits massively from being event driven from version control sources; extending the same courtesy to consumers of the catalog could be equally beneficial to them while significantly offloading the catalog backend itself.
- The internal state machine of the catalog is mostly a black box. It can be challenging to understand why things aren't progressing as expected, and operators regularly resort to digging through backend logs that may or may not contain relevant historical information about the situation. Those logs are also typically not available to entity owners. Making entity owners more self sufficient in being able to diagnose unexpected situations can offload operators and improve the end user experience.
- While the addition of the auditor service helps track some changes on the input side of the catalog, there is no corresponding tracking of internal or end-user-visible output side changes. Arguably those can be equally important in exceptional circumstances to understand outcomes.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

Primary high level goals:

- External systems that want to react to changes to entities in the catalog can subscribe to history events and get near-realtime updates, so that they can avoid resorting to polling.
- End users and administrators can see the historical changes to an entity and related items in the catalog, to understand the "why" of its contents.
- Make the history feature robust and complete enough to implement perfect application level replication of the catalog contents.

Lower level summary of goals:

- The catalog should internally track important history events, at least including create/update/delete of entities (as seen on the public API side), and create/update/delete of locations. This tracking must be reliable including complex cases like cascading deletes, and persistent.
- The catalog should be able to push those history events to the events backend, for easy consumption by other Backstage backend plugins or translation into notifications etc.
- It should be an open possibility to later easily write integrations that push those history events to any other event system, such as PubSub or SQS.
- An external system should be able to subscribe to history events via the REST API, to stream out events as they happen.
- An external system should be able to read history events in a structured way (with filtering) to for example see the complete history of a given entity up until now.
- The catalog may evict history events based on some conditions (event age, or entities being deleted, etc) to recover storage space.
- History events should contain enough metadata to be usefully possible to correlate to things around the catalog. For example, events that are related to a given entity ID / entity ref / URL location should persist those to be able to easily request those events in a context.
- History events should retain the actual historic shapes of the entity body itself, since this allows for more use cases of understanding what happened over time to an entity.
- The events endpoints should be covered by permissions.

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

- This BEP mainly covers the backend parts of the feature. End users of the catalog frontend plugin should be able to inspect the history events related to a given entity as a good initial use case, but that is not given as a required completion goal for this particular BEP.
- Specific implementations for third party receiving event buses are not part of the initial plan.
- The main target database is as always Postgres; the feature may or may not be fully functional for other engines.
- There are many types of events and sources of events that could be conceived including custom ones in processors. But the initial scope is for create/update/remove events for entities and create/update/delete events for locations.
- The initial BEP does not mention conveying credentials of those who take actions that lead to history events. This would be a valuable extension of the system though.
- The BEP does not describe a way of opting out of the feature, for example through config. This could likely be solved, but at a complexity cost that the author does not think is worthwhile.

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

Define a set of semantic event types and their fields, for example `entity_deleted` which then should contain at least the ref, ID, and body of the entity that was deleted.

Add a new history events table to the catalog database. The table has an auto-incrementing integer ID as the primary key which allows the ordered tracking of history.

Add triggers to the `locations` and `final_entities` tables, and specifically to changes to the `final_entity` column in the latter. These triggers add history events accordingly, and send `PG_NOTIFY` signals.

Add a history summary table to the catalog database. Whenever a history entry is added, this table gets updated with the latest event state. This table can be used to quickly ask for a rollup summary of everything you need to update yourself with since any given previous point in the history.

Add a history subscriptions table to the catalog database. This is essentially a place to globally track the progress and filter rules of individual subscribers. It also allows for acknowledgement-based locking, so that even distributed consumers are able to easily read from a subscription all together without synchronizing among themselves.

Add an internal history exporter to the catalog, which leverages the history subscriptions feature to "pump" entries from the history events table as they happen to the events backend where other parts of the Backstage ecosystem can consume them. This feature can be turned on and off with a config flag.

Add a REST API to make direct filtered reads of the history table. This API can have an optional "blocking" feature like the events backend does, to let consumers both just quickly read events as well as long poll for new ones as they happen.

Add a REST API for subscriptions to events. Subscriptions have IDs that the caller supplies, and track a cursor per subscription of where consumption has reached so far. Callers can read from the subscription (using a similar blocking read as above) and have to make acknowledgement requests when done with a batch to unlock the sending of the next batch to any other active subscriber. This way, only one batch is ever active at any given time, making the stream easy to consume in a distributed environment.

Add a janitor class that optionally cleans up history events based on some set of conditions. This could include a hard limit on max event age, or a limit of how long after the deletion of an entity from the catalog that its entire history should be purged all at once. It will also be able to clean up subscriptions that haven't been active for some time.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

The following is the proposed shape of the history events table.

| column         | type                      | description                                                                                           |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `event_id`     | auto-incrementing big int | Auto generated ID                                                                                     |
| `event_at`     | timestamp                 | Auto generated time when the event was generated                                                      |
| `event_type`   | string                    | The distinct type of event                                                                            |
| `entity_ref`   | string or null            | Affected entity ref, where applicable                                                                 |
| `entity_id`    | string or null            | Affected entity UID, where applicable                                                                 |
| `entity_json`  | long text or null         | The body of the affected entity, where applicable (e.g. its shape after updating, or before deletion) |
| `location_id`  | string or null            | The registered location ID affected, where applicable                                                 |
| `location_ref` | string or null            | The location affected, where applicable                                                               |

Triggers `AFTER INSERT OR DELETE OR UPDATE OF final_entity ON final_entities` and `AFTER INSERT OR DELETE OR UPDATE ON locations` are added. These lead to the automatic `INSERT` of a corresponding new history event in the events table. At the same time, a `NOTIFY` signal is sent on the Postgres engine.

Add a REST API to read from the history table directly, on `/history/v1/events`. This allows the consumption of events, optionally with filtering on the available columns above so that you could for example grab the complete history of a given entity, or events on a certain organization URL. This API optionally supports blocking long-poll reads so that you can reliably both read the currently existing history and then stream in whatever happens after that point on. The underlying database mechanisms use Postgres `LISTEN`/`NOTIFY` to efficiently know when to unblock pending blocked readers.

The following is the proposed shape of the history entity summary table.

| column       | type    | description                                                   |
| ------------ | ------- | ------------------------------------------------------------- |
| `entity_ref` | string  | The relevant entity ref                                       |
| `event_id`   | big int | A foreign reference to the last encountered relevant event ID |

The following is the proposed shape of the history subscriptions table.

| column                       | type              | description                                                                                                                             |
| ---------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `subscription_id`            | string            | Unique ID of the subscription                                                                                                           |
| `created_at`                 | timestamp         | When the subscription was created                                                                                                       |
| `active_at`                  | timestamp         | When the subscription was last active (can be used for TTL cleanup)                                                                     |
| `state`                      | string            | Current state - tracks whether it's idle (waiting for someone to read), or has sent data to a reader and is waiting for acknowledgement |
| `ack_id`                     | string or null    | A unique ID that needs to be used to acknowledge the last sent batch (null if in idle state)                                            |
| `ack_timeout_at`             | timestamp or null | When the acknowledgement must have arrived to be valid (null if in idle state)                                                          |
| `last_sent_event_id`         | big int           | The most recent sent event ID to a reader                                                                                               |
| `last_acknowledged_event_id` | big int           | The most recent acknowledged event ID                                                                                                   |
| `filter_entity_ref`          | string or null    | Filter to only events pertaining to this entity ref (if specified at creation time)                                                     |
| `filter_entity_id`           | string or null    | Filter to only events pertaining to this entity UID (if specified at creation time)                                                     |

Add a REST API to create, read, and acknowledge subscriptions, rooted on `/history/v1/subscriptions`.

When subscriptions are initially created, you can choose whether to start from the start of history or from the end (now onward). `last_sent_event_id` and `last_acknowledged_event_id` are then set accordingly to `0` or the current highest available history event ID at that time.

When someone reads from an idle subscription, they get sent a batch of the latest available history events (if any), along with a randomly generated acknowledgement ID. They have to send an acknowledgement request with that ID in a timely manner for the ID columns to be advanced and the subscription to return to idle. At that point any other active subscriber can be sent the next batch. Failure to acknowledge in a timely manner will lead to the batch being considered failed. Then the ID columns are _not_ advanced, which means that the same batch may be issued again to any other active reader.

When someone reads from a busy subscription (which is waiting for an acknowledgement) or a subscription that is already at the end of current history, they can long-poll-block on that request to efficiently wait for when it's due for retrying the read. The underlying database mechanisms use Postgres `LISTEN`/`NOTIFY` to efficiently know when to unblock pending blocked readers.

The events defined are named `entity_created`, `entity_updated`, `entity_deleted`, `location_created`, `location_updated`, and `location_deleted`. They always contain the event ID (as a stringified number to avoid overflow problems) and timestamp (as an ISO string with time zone), and type. In addition they may contain the entity ID, entity ref, entity body, location ID, and/or location ref, depending on whether they are null or not in the database.

An example history event as returned by either API may look as follows:

```json
{
  "eventId": "1234567",
  "eventAt": "2025-06-04T10:22:52.194Z",
  "eventType": "entity_created",
  "entityRef": "component:default/my-component",
  "entityId": "fd8dcb63-8b1b-4de3-9020-6e380ee9d3a8",
  "entity": {
    "apiVersion": "backstage.io/v1alpha1",
    "kind": "Component"
    // ...
  }
}
```

## Release Plan

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

This feature does not change any existing behaviors, and therefore has some freedom in how it gets delivered.

In theory we could for example put the triggers and storage into place and give that some time to get deployed with customers, and postpone making the consumption APIs with the intent of settling on the design of the innards for a bit first. But with proper design and API versioning, a simple all-at-once dump of this feature is unlikely to have negative consequences.

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

No known dependencies.

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->

- The proposed design retains the history itself with the intent of serving more use cases. A simpler implementation could just keep track of for example a single incrementing counter per entity, to track the very fact that it changed, but not how. This would at least allow us to send signals to readers that they need to re-attempt to read something. This severely limits the scope.
- The proposed design persists entity bodies, which comes at a database storage and transmission cost. We could omit the bodies to make the feature less costly, but then one would not be able to track historical changes. This also limits the scope and applicability of the solution. To counter the cost factor, the janitor could get the ability to specifically remove bodies at a shorter cadence than the rest of the entity, and then vacuuming will compact it over time.
- One could use Node code to generate events instead of database triggers. This is unlikely to be feasible. Over a large code base with complex features and things like cascading deletes happening outside of the direct control of the code itself, we are unlikely to be successful with this approach.
- We could lean more toward direct emission of events onto the events backend, and not care about the historical aspect. However, as mentioned above, it is believed that a trigger based mechanism is required in the first place to ensure that the event generation is robust. At that point it's mostly a matter of how short one sets the janitor cleanup intervals to be. And when the data does exist in the database, even transiently, it's tempting to just put a read API for it into place at the same time to open up for more features.
- The feature is proposed to be enabled for everyone, no matter if they intend to leverage it or not. We could make it opt-in, but since it by design uses database triggers and stored procedures, we would either have to put a config table in place (that the triggers read from to know whether to do the insert or not), or outright break out the migration of these triggers and stored procedures into a dedicated migration system that only optionally gets applied. The complexity of that may not be worth the added complexity. With reasonable default janitor cleanup intervals, and events normally not being all that common (only locations and user visible changes lead to events), the cost of the feature may not be all that prohibitive.

## Future Work

In the future, some added features could be considered:

- Track changes to the error state column of entities in the `refresh_state` table, adding an `entity_processing_fails`/`entity_processing_succeeds` event when it starts/stops failing. This could be coupled to the notification system.
- Track deliveries into `refresh_state` from entity providers, for example as `entity_input_changed` when it actually did change from last time, letting you track the whole cycle of changing in your version control system -> entity gets ingested -> entity starts failing processing etc.
- Track who the responsible actor is when things happen. If `locations`, `refresh_state`, and `final_entities` had a `last_actor` field that got passed down to be updated from each previous stage, the triggers could pick up on that and persist it as a new field in the history table and emitted events. Then you would have an audit trail of the initiator of things that happened in the system.
- Write emitters (maybe as events backend modules) for pushing these history events to more third party carriers / buses
- Implement more frontend features based on this system, for example in the Backstage frontend having a popup saying that the entity seems to have changed, do you want to refresh the page?

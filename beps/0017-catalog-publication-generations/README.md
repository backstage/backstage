---
title: Catalog Publication Generations and Tombstones
status: implementable
authors:
  - '@freben'
owners:
  - '@freben'
project-areas:
  - catalog
creation-date: 2026-10-17
---

# BEP: Catalog Publication Generations and Tombstones

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
  - [Schema](#schema)
  - [Assigning generations](#assigning-generations)
  - [Tombstones](#tombstones)
  - [Capturing deletions](#capturing-deletions)
  - [Consuming changes](#consuming-changes)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

The catalog has no reliable way to answer "what changed since I last looked?". This BEP proposes adding that to the catalog's storage layer, without changing how entities are ingested or processed.

Every time the stitcher publishes a change to an entity, it stamps the published row with a **generation**. Generations come from a single counter, and they are allocated in commit order. Deleted entities leave a **tombstone** behind instead of disappearing, so deletions get a generation too.

A consumer remembers the highest generation it has seen. It asks for the refs that have a higher generation, then reads those refs back through the existing by-refs endpoint. This gives caches, search indexers and event emitters a cheap, complete, restartable change feed.

## Motivation

Today, anything that wants to mirror the catalog has to re-read all of it periodically. Examples include the search collator, catalog caches in other backends, and integrations that want to emit events. That costs a lot on large installations, and changes still arrive late. Several attempts at catalog events have failed for the same reason: the catalog cannot say in a durable way what changed or in what order. See [#8219](https://github.com/backstage/backstage/issues/8219).

Two properties of the current schema block this:

- Nothing on `final_entities` is ordered by commit. `last_updated_at` is a wall-clock timestamp, and two transactions can commit in the opposite order to their timestamps. A consumer polling with `last_updated_at > :t` can miss changes for good.
- Deletions leave no trace. `final_entities.entity_id` references `refresh_state` with `ON DELETE CASCADE`, so the published row disappears in the same statement that removes the candidate.

### Goals

- Every published change carries a generation. If a consumer has seen generation N, every change with a lower generation has already committed and is visible to it.
- Deleting an entity publishes a tombstone with its own generation, whichever code path deleted its candidate.
- A consumer can bootstrap from a consistent snapshot and then follow changes incrementally, without missing any.
- PostgreSQL write throughput stays acceptable, with no rewrite or backfill of existing rows.

### Non-Goals

- **History or audit logs.** A ref keeps only its latest generation. Intermediate states are not retained. History is a separate, optional capability. See the proposed [Catalog History and Events BEP](https://github.com/backstage/backstage/pull/30146).
- **The exact public API shape.** This BEP specifies the storage contract and the intended consumption pattern. Endpoint names, permissions and client helpers will be designed in follow-up PRs.
- **Exactly-once or diff semantics.** Consumers receive hints, not diffs (see [Consuming changes](#consuming-changes)).
- **Tombstone retention or compaction.** Tombstones are kept indefinitely for now.
- **Equal guarantees on other databases.** PostgreSQL is the primary target. MySQL and SQLite get the same schema and semantics on a best-effort basis.

## Proposal

1. Make stitching publish the final row and its search rows in a single, fenced transaction. This is done ([#35867](https://github.com/backstage/backstage/pull/35867), [#35976](https://github.com/backstage/backstage/pull/35976)).
2. Add a commit-ordered generation to every real published change ([#36025](https://github.com/backstage/backstage/pull/36025)).
3. Teach the stitcher to tombstone a ref whose candidate is gone, and keep a stable final row per entity ref.
4. Replace the cascading delete from `refresh_state` to `final_entities` with a trigger. The trigger asks the stitcher to reconcile the deleted ref.
5. Once the steps above are complete, expose a refs-only change endpoint.

## Design Details

### Schema

```sql
-- Single-row counter. Its value is internal and never exposed.
CREATE TABLE catalog_generation_counter (
  id         integer PRIMARY KEY CHECK (id = 1),
  generation bigint  NOT NULL CHECK (generation >= 0)
);
INSERT INTO catalog_generation_counter VALUES (1, 0);

ALTER TABLE final_entities
  ADD COLUMN generation bigint NULL,      -- step 2
  ADD COLUMN deleted_at timestamptz NULL; -- step 3, informational only

CREATE INDEX CONCURRENTLY final_entities_generation_idx
  ON final_entities (generation) INCLUDE (entity_ref)
  WHERE generation IS NOT NULL;

-- Step 4
ALTER TABLE final_entities
  DROP CONSTRAINT final_entities_entity_id_foreign; -- the cascade from refresh_state
```

All columns are nullable, so existing rows are not rewritten or backfilled. Existing rows keep a null generation until they are next published. The partial index starts out empty, but PostgreSQL still has to scan the table to build it. Large installations can build the same index in advance, outside the migration, and the migration skips it if a valid copy exists.

`search` keeps its foreign key to `final_entities`. It does not change.

### Assigning generations

PostgreSQL sequences cannot provide commit order. A transaction can draw 101 and commit while the transaction holding 100 is still open, and a consumer that has seen 101 then skips 100 when it commits. Instead, the generation comes from updating the counter row. That row lock is held until commit, so generations become visible in allocation order.

To keep that serialized window short, the generation is allocated **last**:

1. Write the final body and synchronize the search rows, taking all other locks first.
2. Increment the counter and stamp the already-locked final row.
3. Commit. Stitch queue settlement happens in a separate transaction afterwards.

On PostgreSQL, steps 2 and 3 are one: a deferred constraint trigger allocates inside `COMMIT`, after all other work in the transaction, with no client round trip while the counter is held. PostgreSQL makes a transaction visible before it releases its locks, so a later allocation cannot become visible first.

```sql
CREATE CONSTRAINT TRIGGER final_entities_assign_generation_at_commit
  AFTER INSERT OR UPDATE OF final_entity ON final_entities
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION final_entities_assign_generation_at_commit();
```

The function increments the counter and writes the returned value to `NEW.entity_id`'s row. It fires only on body writes, so its own generation update does not fire it again. MySQL and SQLite allocate in application code as the last statements before commit.

A changed publication therefore writes the final row twice, once for the body and once for the generation. That is deliberate. Search rows reference `final_entities`, so a new entity's final row has to exist before its search rows can be written. Allocating in the body write instead would hold the counter lock while search is synchronized, which measured far slower.

The trigger replaced an earlier plan to allocate with a writable CTE sent from the stitcher. On a staging catalog of about 767,000 entities, the counter holder under that plan spent about a quarter of its time idle in transaction, waiting for the round trip back from the stitcher before `COMMIT`. Forced re-stitches measured about 330 entities per second without allocation, 320 with the trigger, and 250 to 285 with the CTE. Allocation adds about 10 to 20% WAL per publication.

Unchanged stitches (same hash) and rolled-back attempts do not allocate. A future batched publication takes the counter lock once per transaction. Because constraint triggers are per-row, the rows get consecutive generations on PostgreSQL rather than one shared value; consumers must accept either.

Per-entity publication still has a ceiling, because each commit holds the counter through its WAL flush. With the earlier CTE allocation, a local benchmark with a 0.6 ms database round trip topped out at roughly 900 changed entities per second. Batching about 25 entities per transaction under one generation reached around 3,000 per second. That batching is the planned escape hatch for bursts such as mass re-ingestion, and steady-state behavior does not need it.

### Tombstones

> An entity exists if and only if its `final_entities` row exists and `final_entity IS NOT NULL`.

That rule is the only presence test. `deleted_at` and `generation` are informational and must never be used as alternative ways to decide deletedness.

When the stitcher finds that a published ref has no candidate left, it does the following in one publication transaction:

- sets `final_entity = NULL` and `deleted_at = now()`
- deletes the ref's search rows
- assigns a generation

Stitching a ref that is already tombstoned does nothing. A ref that was never published gets no tombstone.

Existing read paths must treat a tombstone as absent. That includes entity lists, lookups by name and by refs, facets and counts. Step 3 includes auditing those queries.

The row is kept as a slot for that entity ref. If the entity is ingested again, the stitcher reuses the row and its internal `final_entities.entity_id`. The published `metadata.uid` still comes from the new candidate, so it changes after a delete and re-create, exactly as today. Internally, `final_entities.entity_id` and `metadata.uid` stop being guaranteed equal, and step 3 audits the code that assumes they are.

`DELETE /entities/by-uid/:uid` keeps deleting by candidate ID, so a stale UID can never remove a successor that was ingested later.

### Capturing deletions

Candidates are deleted in many places: provider mutations, orphan cleanup, the by-uid endpoint, and manual repairs. Rather than relying on every one of them to remember, PostgreSQL captures all of them with a statement-level trigger:

```sql
CREATE FUNCTION catalog_enqueue_stitch_for_deleted_refresh_state()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO stitch_queue (entity_ref, stitch_ticket, failure_count, next_stitch_at)
  SELECT entity_ref, gen_random_uuid()::text, 0, now()
  FROM deleted_rows
  ORDER BY entity_ref
  ON CONFLICT (entity_ref) DO UPDATE
    SET stitch_ticket = EXCLUDED.stitch_ticket,
        failure_count = 0; -- keep next_stitch_at: don't steal an active lease
  RETURN NULL;
END $$;

CREATE TRIGGER refresh_state_stitch_enqueue
  AFTER DELETE ON refresh_state
  REFERENCING OLD TABLE AS deleted_rows
  FOR EACH STATEMENT
  EXECUTE FUNCTION catalog_enqueue_stitch_for_deleted_refresh_state();
```

The trigger only **detects** deletions. It does not decide anything: it does not allocate a generation or touch `final_entities`. It requests a stitch with the same contract as application code: a new ticket, a reset failure count, and an unchanged `next_stitch_at` when a row already exists. The stitcher then publishes the tombstone, and that publication gets the generation. Until the stitch commits, the old body and its search rows stay visible together.

MySQL and SQLite only have row-level triggers, so they get an `AFTER DELETE ... FOR EACH ROW` trigger with the same enqueue contract. That costs more for wide deletions but behaves the same. MySQL does not fire triggers for foreign key actions, but nothing cascades into `refresh_state`, so every candidate deletion is a direct one.

Existing relation-peer restitching and orphan policies are unchanged.

Without the foreign key, publication has to take the lock that the foreign key used to take implicitly. Its first statement takes a key share lock on the candidate row (`FOR KEY SHARE` on PostgreSQL, a shared lock on MySQL; SQLite has a single writer), held until commit. If the candidate is already gone, the publication abandons. Otherwise deleting the candidate waits for the publication to commit, and the deletion's stitch request then sees the committed body and tombstones it. Without that lock, a publication that stalled past its lease could commit a live body after the deletion's stitch had already found nothing to tombstone and settled. The lock order is candidate, then final row, then generation counter. A key share lock does not block updates to the candidate's other columns, so processing is not slowed down on PostgreSQL.

A tombstone publication has no candidate to lock. A re-created candidate replaces the stitch ticket when it asks to be stitched, and the ticket guard and ownership recheck stop a tombstone from overwriting it.

### Consuming changes

The feed returns **refs only**:

```sql
SELECT entity_ref, generation
FROM final_entities
WHERE generation > :watermark
ORDER BY generation
FETCH FIRST :n ROWS WITH TIES;
```

`WITH TIES` makes `:n` a soft limit. A page never ends partway through a generation, so refs that share one cannot be split across pages and skipped.

MySQL and SQLite don't support `WITH TIES`. There, the feed reads `:n + 1` rows. If the last two have the same generation, the page would split it, so the feed drops the extra row and fetches the rest of that generation with `WHERE generation = :g`. This is safe without a surrounding transaction: rows that share a generation commit together, so once one is visible, all of them are.

A consumer reads the bodies back through the existing `POST /entities/by-refs`. A tombstoned ref comes back as `null`, exactly like a ref that never existed, so deletions use the same code path as any other change. Reading back gives the **current** state, so a consumer converges on the latest state instead of replaying intermediate states it doesn't need. This works the same for a cache, a search indexer, or a component that emits change events.

Consumers must follow this contract:

- **A bump is a hint.** It means a ref may have changed. The same body can come back with a new generation. A consumer cannot tell that apart from a change from A to B and back to A anyway, so consumers must be idempotent.
- **Gaps are normal**, and several refs can share one generation.
- **Advance the watermark to the highest generation in the processed feed page.** Never use generations seen during the readback, because that would skip refs outside the current page. The counter itself is never read or exposed.
- **Bootstrap with a full read.** Rows from before this change have a null generation, so the feed alone is not a complete snapshot. For each page of the initial full read, read `COALESCE(max(generation), 0)` over `final_entities` and then the page's entities in one `REPEATABLE READ` transaction. Keep the earliest of those values as the starting watermark, normally the first page's. The `COALESCE` matters for an empty or freshly upgraded catalog, where every generation is still null; zero is safe because real generations start at 1. Anything that commits during the bootstrap is replayed by the incremental tail.
- **Page the bootstrap by cursor, ordered by `final_entities.entity_id`.** That is the default order of `GET /entities/by-query` when no sort fields are given. Offset pagination is not safe: if an earlier row is tombstoned between pages, every later row shifts down by one and an unchanged row is skipped, with no newer generation to recover it. Sorting by fields has the same problem when a sort value changes. The internal ID is stable even across delete and re-create, so a cursor on it cannot skip rows that keep existing.

## Release Plan

Steps 1 and 2 are additive and internal. They need no fence and ship as ordinary migrations. On PostgreSQL the trigger also assigns generations to writes from older instances during a rolling deploy. On MySQL and SQLite an older instance can overwrite a body and keep a stale generation. That is acceptable, because nothing promises completeness yet.

Steps 3 and 4 change who owns the lifetime of a final row. An old stitcher assumes the final row ID equals the candidate ID, and it drops work when the candidate is missing. So the cascade must not be removed while old workers are still running. The plan is:

- Step 3 ships as compatible code and additive schema, inactive.
- Step 4 is activated behind an explicit mixed-version fence, such as a capability check or a documented maintenance cutover, and must support installations that skip releases.

The public change endpoint is added only after step 4. Its API surface will follow the usual alpha-then-stable path.

## Dependencies

- [#35867](https://github.com/backstage/backstage/pull/35867) and [#35976](https://github.com/backstage/backstage/pull/35976): atomic, fenced stitching (merged).
- [#36025](https://github.com/backstage/backstage/pull/36025): step 2, generations (merged).
- The proposed [Catalog History and Events BEP](https://github.com/backstage/backstage/pull/30146) is complementary. A history table could be filled by a trigger on `final_entities` that ignores updates which only change the generation.

## Alternatives

- **Sequences or `BIGSERIAL`.** Allocation order does not match commit order, so consumers would silently miss changes.
- **Per-entity versions, plus a history table with an autoincrement key.** A trigger would append the ref and its local version to the history table on every change, and the autoincrement key would serve as the global position. That key is assigned when the row is inserted, not when the transaction commits, so it has the same gap problem as a sequence. Closing the gap takes either a lock held until commit, which is this design with an extra table, or reading only up to a transaction-visibility horizon, which works only on PostgreSQL. The history table also grows without bound, so it needs pruning and a recovery path for consumers that fall behind it. Deletions need their own trigger, and readers have to dedupe repeated refs. A per-entity version is still useful for ETags or optimistic concurrency, and it can be added next to the generation later.
- **Polling `last_updated_at >= :t`.** Timestamp order isn't commit order either. Polling is only safe with a re-read window longer than an enforced publication timeout.
- **Allocating in an earlier, separately committed transaction, or running with `synchronous_commit = off`.** Both break commit order. With `synchronous_commit = off`, a crash can also reissue a generation that a consumer has already seen.
- **A per-row version or hash without a global order.** Consumers could detect a change only by re-reading everything.
- **Hard-deleting final rows and keeping a separate deletions log.** That adds a second structure that must stay consistent with `final_entities`, and the feed would have to merge two sources in commit order.
- **A foreign key action instead of a trigger.** No referential action can turn a delete into "clear the body and set `deleted_at`". That decision belongs to the stitcher.
- **Returning bodies from the feed.** This needs an inline deleted marker that consumers forget to check, and it returns old state instead of current state.

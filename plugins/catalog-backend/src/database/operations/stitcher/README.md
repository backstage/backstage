# Publication generations

This is internal publication bookkeeping, not a change-feed API. Existing rows
remain null until a changed publication, and old-instance writes are untracked.
Deletions are tracked as tombstones (see below). See [upgrade guidance](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/README.md#upgrading-large-installations).

The existing hash check skips unchanged output in ordinary operation. Overlapping
attempts may still publish identical content with distinct generations. Consumers
must tolerate repeated content and gaps: rows retain only their latest generation,
and intermediate publications or deleted rows are not retained as history.

## Final rows, slots and tombstones

A final entity row is a slot for its entity ref. Its `entity_id` starts out
equal to the first candidate's `refresh_state.entity_id`, but it is kept when
the entity is deleted and created again. The published `metadata.uid` always
comes from the current candidate. Never join `final_entities.entity_id` or
`search.entity_id` to `refresh_state.entity_id`; join on `entity_ref` instead.

An entity exists if and only if its final row exists and `final_entity` is not
null. `deleted_at` is informational.

A trigger on `refresh_state` deletions requests a stitch for every deleted ref,
using the same ticket contract as application code. PostgreSQL uses one
statement-level trigger per deletion; MySQL and SQLite only have row-level
triggers, which cost more for wide deletions but behave the same. When the stitcher then finds no candidate for a live slot, it clears the
body, deletes the search rows and assigns a generation in one publication.
Re-creation revives the same slot. The hash is the plain content hash while the
slot and candidate IDs match; otherwise the candidate ID is folded in, so that
identical content from a new candidate still publishes its new UID.

## Transaction and lock order

Final entity, search entries, and generation commit together. The singleton
counter uses a transaction, not a sequence: the next allocator waits for commit
or rollback, and rollback restores both publication and counter. Decimal strings
preserve bigint precision in JavaScript.

Final rows no longer reference `refresh_state`, so publication takes the lock
that the foreign key used to take implicitly: its first statement takes a key
share lock on the candidate (a shared lock on MySQL), held until commit. If
the candidate is already gone, the publication abandons. Otherwise deleting
the candidate waits for the publication, and the deletion's stitch request,
which replaces the ticket but keeps the current lease, then sees the committed
body and tombstones it. Without that lock, a publication that stalled past its
lease could commit a live body after the deletion's stitch had already found
nothing to tombstone and settled.

Lock the candidate, write and validate the final entity, then synchronize search. With publication
locks held, PostgreSQL increments the counter in a writable CTE and assigns its
returned generation to the final entity in the same statement, then commits
promptly. SQLite and MySQL use separate counter and assignment statements. Never acquire queue or unrelated entity locks after the counter lock.
Claim settlement stays after commit. Publication requires a root connection;
releasing a nested `SAVEPOINT` would retain the counter lock into queue settlement.

## Performance validation

The planned future lookup is a bounded generation-range scan returning refs from
the partial covering index, with final bodies fetched separately. Verify that
plan and existing entity reads under realistic churn and statistics; an included
column does not guarantee an index-only scan.

Measure counter waits, changed-publication throughput, transaction duration,
index writes, WAL, and dead tuples before rollout. The counter serializes each
publication's final update and commit, and the second row version changes an
indexed column, preventing a HOT update. Candidate lookup and generation assignment
should remain single-row primary-key index probes. PostgreSQL is the performance
target; MySQL and SQLite retain their existing best-effort ownership semantics.

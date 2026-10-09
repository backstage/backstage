# Publication generations

This is internal publication bookkeeping, not a change-feed API. Existing rows
remain null until a changed publication; deletions and old-instance writes are
untracked. See [upgrade guidance](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/README.md#upgrading-large-installations).

The existing hash check skips unchanged output in ordinary operation. Overlapping
attempts may still publish identical content with distinct generations. Consumers
must tolerate repeated content and gaps: rows retain only their latest generation,
and intermediate publications or deleted rows are not retained as history.

## Transaction and lock order

Final entity, search entries, and generation commit together. The singleton
counter uses a transaction, not a sequence: the next allocator waits for commit
or rollback, and rollback restores both publication and counter. Decimal strings
preserve bigint precision in JavaScript.

On PostgreSQL, take the originating candidate's key-share lock before writing
the final row. Updating a final row twice in one transaction can recheck its FK
even without changing the key. The early parent lock prevents an inversion with
cascading deletion, which locks refresh state before final entities.

Write and validate the final entity, then synchronize search. With publication
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

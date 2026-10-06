# Publication generations

Changed stitcher publications receive an internal, commit-ordered generation.
This is groundwork, not a change-feed API: legacy rows are not updated,
deletions are still untracked, and older instances in a rolling deployment can
publish without advancing the generation. Unchanged and abandoned attempts do
not allocate. Retrying after publication committed but claim settlement failed
therefore does not allocate again.

## Transaction and lock order

The final entity, search entries, and generation commit together. A singleton
counter row is updated in the publication transaction, not through a PostgreSQL sequence.
A later allocator waits until the earlier allocator commits or rolls back;
rollback restores both the publication and counter. Values cross the JavaScript
boundary as decimal strings to preserve bigint precision.

On PostgreSQL, acquire the originating refresh-state row's key-share lock before
writing the final entity. A second update of a final row changed by the same
transaction can recheck its foreign key even without changing the referenced
key. Without the early key-share lock, assigning a generation can deadlock with
cascading deletion, which locks refresh state before final entities.

Write and validate the final entity and synchronize search before allocating.
Then update the already-locked final row and commit promptly. Never acquire
queue or unrelated entity locks after taking the counter lock. Claim settlement
stays outside the publication transaction. Publication requires a root database
connection: accepting an outer transaction would retain the counter lock across
`SAVEPOINT` release and acquire queue locks during settlement before outer commit.

## Migration and performance

The nullable bigint column has no default or backfill. The PostgreSQL index is
`final_entities_generation_idx ON final_entities (generation) INCLUDE
(entity_ref) WHERE generation IS NOT NULL`. It is built concurrently, but still
scans the entire heap even when every generation is null. A five-second local lock
timeout bounds metadata lock waits, **not** transaction duration or the concurrent
index phase.
That phase can wait for existing transactions and has no imposed timeout. It
must be scheduled or cancelled operationally on large installations. Session
timeout changes are avoided because transaction-pooling proxies do not pin a server
between automatically committed statements. The schema DDL
transaction commits before the index scan so it does not retain its exclusive
table lock throughout that scan.

Large installations can prepare the column and exact index out of band before
starting the upgraded service. Run against the catalog plugin's schema, outside
a transaction for the concurrent index command:

```sql
ALTER TABLE final_entities ADD COLUMN IF NOT EXISTS generation bigint;
CREATE INDEX CONCURRENTLY final_entities_generation_idx
  ON final_entities (generation) INCLUDE (entity_ref)
  WHERE generation IS NOT NULL;
```

Inspect for an existing or invalid index before running these commands. The
migration skips an existing valid index and repairs an invalid one left by an
interrupted concurrent build. Reruns do not reset the counter. Down migration
discards generation bookkeeping but preserves entity and search contents.

The planned future lookup is a bounded generation-range scan returning refs
from this index, with final bodies fetched separately. This PR adds no such
reader. Validate that query plan on realistic data before exposing consumption.
Measure counter wait time, changed-publication throughput, transaction duration,
WAL and dead-tuple pressure under concurrent publication before rollout; the
singleton counter serializes the last part of every changed publication.
The additional final-row update and index maintenance are intentional costs,
not assumed free. The extra candidate lookup and generation assignment should
remain single-row primary-key index probes, not table scans; verify their plans
alongside the existing reads under realistic statistics. PostgreSQL is the
performance target. SQLite uses a partial
covering index and MySQL a full covering index; both use transactional counter
updates, with existing best-effort stitch ownership semantics unchanged.

# Critical Bug: Catalog Entities Become Permanently Stuck in Unstitched State When Stitching Fails After Processing Succeeds

## Affected File(s) + Component(s)

- **Primary:** `/plugins/catalog-backend/src/processing/DefaultCatalogProcessingEngine.ts`
  - Lines 291-309 (transaction commits before stitch)
  - Lines 336-338 (unguarded stitch call)
  - Lines 241-247 (hash comparison short-circuits stitching on retry)
  - Lines 341-344 (catch block doesn't distinguish failure types)

- **Secondary:** `/plugins/catalog-backend/src/database/DefaultProcessingDatabase.ts`
  - Lines 91-106 (`updateProcessedEntity` writes `resultHash` to database)

- **Component:** `DefaultCatalogProcessingEngine` / Catalog Processing Pipeline / Stitcher Integration

## Exact Problem

When an entity is processed successfully but the subsequent stitching operation fails, the entity becomes **permanently stuck** in an unstitched state and invisible to users.

**The problematic code flow in `DefaultCatalogProcessingEngine.ts`:**

```typescript
// Lines 291-309: Transaction COMMITS here, including resultHash
await this.processingDatabase.transaction(async tx => {
  const { previous } = await this.processingDatabase.updateProcessedEntity(tx, {
    id,
    processedEntity: result.completedEntity,
    resultHash,              // ← Saved to database BEFORE stitch
    errors: errorsString,
    relations: result.relations,
    deferredEntities: result.deferredEntities,
    locationKey,
    refreshKeys: result.refreshKeys,
  });
  // ...
});

// Lines 336-338: Stitch called AFTER transaction commits, with NO try-catch
await this.stitcher.stitch({
  entityRefs: setOfThingsToStitch,
});
```

**On subsequent processing runs (lines 241-247):**

```typescript
if (resultHash === previousResultHash) {
  // If nothing changed in our produced outputs, we cannot have any
  // significant effect on our surroundings; therefore, we just abort
  // without any updates / stitching.
  track.markSuccessfulWithNoChanges();
  return;  // ← Entity never gets stitched!
}
```

**What happens at runtime:**

1. Entity processing succeeds → `updateProcessedEntity` commits `resultHash` to database
2. `stitch()` is called but fails (database issue, timeout, network error, etc.)
3. Exception bubbles to catch block (line 341) → `track.markFailed(error)` logs failure
4. Entity's `next_update_at` was already updated → eventually requeued for processing
5. **On retry:** `resultHash` matches (nothing changed) → processing skipped at line 246
6. **Entity is never stitched** → remains invisible in `final_entities` table forever

## Why This Is Critical

### Data Integrity
- Entities are **written to `refresh_state`** with full processing results but **never appear in `final_entities`**
- Relations are written but never reflected in the stitched entity graph
- Creates orphaned data that accumulates over time

### Silent Failure
- The `markFailed` tracking only logs at WARN level with a generic message
- No distinction between processing failure vs. database failure vs. stitching failure
- Metrics show "failed" but operators cannot identify the root cause
- No automated recovery mechanism exists

### User Impact
- Platform teams register entities via catalog-info.yaml → entities "disappear"
- UI shows entity as non-existent while database contains processed data
- Relations graph is broken (source entities exist, targets don't)
- Extremely difficult to diagnose without deep database inspection

### Who Is Affected
- **All Backstage deployments** (not limited to multi-instance setups)
- More likely in production environments with database latency/timeouts
- Enterprises with large catalogs (more stitching operations = higher failure probability)

### This May Be a Regression
The stitching logic was refactored in recent versions to support deferred stitching strategies. The separation of transaction boundaries from stitch operations may have inadvertently introduced this failure mode.

## How To Reproduce (Realistic)

1. **Deploy Backstage** with PostgreSQL in an environment with occasional network latency
2. **Register multiple entities** via catalog-info.yaml locations
3. **Simulate stitcher failure** by any of:
   - Database connection timeout during `stitch()` call
   - Temporary database overload (high concurrent writes)
   - Network partition between app and database during stitching
4. **Observe:** Entity processing succeeds (visible in logs), but entity never appears in catalog UI
5. **Wait for next processing cycle:** Entity is NOT reprocessed because `resultHash` matches
6. **Verify:** Entity exists in `refresh_state` with `processed_entity` populated, but `final_entities` has no corresponding row (or stale row)

**Database verification:**
```sql
-- Find stuck entities: exist in refresh_state but not properly stitched
SELECT rs.entity_ref, rs.result_hash, fe.entity_id
FROM refresh_state rs
LEFT JOIN final_entities fe ON rs.entity_id = fe.entity_id
WHERE rs.processed_entity IS NOT NULL
  AND (fe.entity_id IS NULL OR fe.last_updated_at < rs.next_update_at);
```

## Root Cause

1. **Incorrect transaction boundary:** `resultHash` is written to the database inside a transaction that commits BEFORE the stitch operation executes
2. **Missing error handling:** The `stitch()` call at line 336 has no try-catch wrapper
3. **Hash-based idempotency defeats retry:** The `resultHash === previousResultHash` check (line 241) prevents re-stitching on subsequent runs
4. **No stitch state tracking:** There's no separate flag indicating whether stitching succeeded, only whether processing output changed

## Minimal Fix Approach

**Option A: Only write resultHash after successful stitch (safer)**

```typescript
// Move resultHash write AFTER stitch succeeds
let pendingResultHash = resultHash;
await this.processingDatabase.transaction(async tx => {
  await this.processingDatabase.updateProcessedEntity(tx, {
    id,
    processedEntity: result.completedEntity,
    resultHash: '',  // Don't commit hash yet
    // ...other fields
  });
});

await this.stitcher.stitch({
  entityRefs: setOfThingsToStitch,
});

// Only now commit the hash
await this.processingDatabase.transaction(async tx => {
  await tx('refresh_state')
    .where('entity_id', id)
    .update({ result_hash: pendingResultHash });
});
```

**Option B: Catch stitch errors and clear resultHash (simpler)**

```typescript
try {
  await this.stitcher.stitch({
    entityRefs: setOfThingsToStitch,
  });
} catch (stitchError) {
  // Clear resultHash so entity will be re-processed
  await this.processingDatabase.transaction(async tx => {
    await tx('refresh_state')
      .where('entity_id', id)
      .update({ result_hash: '' });
  });
  throw stitchError;  // Re-throw to trigger markFailed
}
```

**Option C: Add stitching success flag (most robust)**

Add a `stitch_pending` boolean column to `refresh_state`, set it to `true` before stitch, and clear it after successful stitch. Modify `getProcessableEntities` to also return entities with `stitch_pending = true`.

## Impact After Fix

1. **Entities no longer permanently stuck:** Failed stitching results in retry on next processing cycle
2. **Self-healing:** Transient stitching failures automatically recover
3. **Observable failures:** Clear distinction between processing and stitching errors
4. **Data integrity restored:** All successfully processed entities eventually appear in catalog
5. **Production reliability:** Enterprises can trust that registered entities will become visible
6. **Reduced support burden:** No more "entity disappeared" incidents requiring manual database intervention

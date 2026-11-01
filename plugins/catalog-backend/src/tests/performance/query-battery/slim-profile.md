# Slim battery profile

The full battery runs every scenario with and without permissions, for several
claim lists, with repeated runs. A run on a production-scale database can take
hours. This profile cuts the work by relying on assumptions about how long
`$in` lists are compiled. They hold for the code at the time of writing.

Every cut names the assumption it relies on, how to check it, and what makes it
invalid. If a check fails, or the change under test touches something listed
under "Invalidated by", do not apply that cut. Run the full matrix for the
affected cases instead, say so in the report, and push back if a slim run was
requested anyway. Never fall back to a smaller matrix silently.

## Cuts

### C1. Only the baseline and the candidate

- **Cut:** measure only the current code (the baseline) and the change under
  test. Drop other experimental variants.
- **Assumption:** other variants are only reference points.
- **Invalidated by:** a request to compare strategies.

### C2. Identical SQL runs once

- **Cut:** when the candidate generates byte-identical SQL to the baseline for
  a case, run it once to compare results, and reuse the baseline's timing.
- **Assumption:** on PostgreSQL, only `$in` lists with at least
  `IN_SUBQUERY_MIN_VALUES` values (10 at the time of writing, see
  `src/service/request/longInLists.ts`) are compiled differently. Scenarios
  without permissions, short claim lists and filters with short lists produce
  the same SQL.
- **Check:** compare the generated SQL strings, not the claim count. Read the
  threshold from the code under test and print it in the report.
- **Invalidated by:** any change to the threshold, to which operators are
  compiled as sets, or to the rule that decides when a long list is joined as a
  set rather than matched with `IN`. If the threshold changes, also revisit the
  claim lists in C4.

### C3. One run instead of a median of five

- **Cut:** time each case once. Rerun it five times, interleaved with the
  baseline, when the ratio between candidate and baseline is between 0.5 and 2,
  or when either is close to a bar (0.3-1.5 s for a UI page, 3-10 s for a
  10,000-row stream page).
- **Assumption:** the differences that matter are at least 2x. Single runs on a
  shared database vary by up to about 1.5x, and one-off spikes of 3x happen.
- **Invalidated by:** a change aimed at smaller effects.

### C4. Claim lists of 3, 10, 40, and one large claim

- **Cut:** measure the `_perm` variants with 3 claims (below the threshold), 10
  (at it), 40 (a large but realistic membership), and a list that includes one
  claim owning a large share of the catalog.
- **Assumption:** lists of more than about 40 claims are not a supported
  performance target at the time of writing. The large claim covers both a long
  list and a huge single set.
- **Invalidated by:** a threshold change (the lists must include
  `threshold - 1` and `threshold`), a decision to support longer lists, or a
  large-claim result close to a bar. Add a long list without the large claim
  then.

### C5. Skip the unfiltered stream

- **Cut:** skip streaming the whole catalog without a request filter.
- **Assumption:** its SQL is identical to the baseline's (C2).
- **Check:** as in C2. If the SQL differs, it must run.
- **Invalidated by:** changes to the permission filter used, or to the
  streaming query itself (cursor or ordering).

### C6. Streams without permissions run once

- **Cut:** run streams with request filters but no permission filter once,
  baseline and candidate only.
- **Assumption, check, invalidation:** as in C2.

## Never cut

- Comparing the returned entity IDs with the baseline for every case that ran.
- Checking plans for per-row `= ANY(array)` SubPlans, lost LIMIT
  short-circuiting, and large sorts.
- Scenarios 12, 13, 14, 18, 19, 20 and 21, and the owned-entities page.
  These are known to be sensitive to how long lists are compiled.
- On a replica: checking `pg_is_in_recovery()` first, running one query at a
  time, and checking `pg_stat_activity` for leftovers at the end.

## Report header

Every slim report starts with:

1. The threshold and the join-or-`IN` rule found in the code under test.
2. For each cut C1-C6: applied or not, and why.
3. Which cases were rerun under C3.

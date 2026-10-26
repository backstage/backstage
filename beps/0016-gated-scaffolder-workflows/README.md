---
title: Gated Scaffolder Workflows
status: implementable
authors:
  - '@spiffaz'
owners:
  - '@spiffaz'
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2026-07-22
---

# BEP: Gated Scaffolder Workflows

## Summary

Scaffolder tasks today run their actions straight through to completion. There is no supported way for a running task to stop, wait for something outside the task (a human decision, a merged pull request, an external system provisioning a resource), and then continue. This BEP adds a durable `waiting` task state plus a suspend/resume primitive: an action calls `ctx.suspend(...)` to park its task, and an authenticated, permission-gated endpoint resumes it. Resume works by replaying the suspended action's handler, with the suspend point behaving as a checkpoint that returns the resume payload, so it composes with the existing idempotency/checkpoint machinery rather than introducing a coroutine model. Approval workflows, wait-for-merge, and wait-for-external-resource all become thin consumers of this one primitive.

## Motivation

Three long-standing requests describe the same missing capability from different angles:

- #13809 wants an `approval:request` step so sensitive actions do not run until someone approves.
- #16622 wants gated workflows that can pause for PR merges, approvals, and resource creation spanning days, and explicitly asks for an RFC.
- #23967 wants broader workflow orchestration.

Each was told, in effect, that this belongs in the framework rather than in a plugin. The precise limitation is that a plugin cannot introduce a new task state or park a running task. The #13809 attempt ran into an adjacent wall - the public API does not let a plugin manipulate a template's action execution - which is the same boundary: driving the engine's internals is not a plugin capability. Note this is specifically about suspending and resuming a running task. Launching a fresh task from a plugin is already supported (via `scaffolderServiceRef.scaffold`), which is why the interim plugin in the Release Plan can work today without this BEP.

Meanwhile every adopter that needs approvals builds the same workaround: split the flow into two tasks glued by an external service, or gate on a pull request merge. These work but are reinvented per company, never upstreamed, and do not cover flows with no Git artifact to merge (access grants, sandbox provisioning, quota requests).

The framework is growing the substrate needed to do this correctly. BEP-0004 (task idempotency) adds checkpoints, workspace serialization, and recover-on-restart so the engine can restore in-flight tasks after a crash or redeploy. A `waiting` state extends that machinery: a waiting task is one the executor is not allowed to claim until a signal arrives, and resume reuses the same replay-and-skip mechanism recovery already relies on.

This is the design the scaffolder maintainers have asked for, not a speculative one. #16622 is open and described as the most-requested scaffolder enhancement; its motivating framing is that these states are "best handled by the framework because there are many ways to mess this up." The lead scaffolder maintainer proposed the concrete shape - rely on the events-backend for an HTTP ingress to resume existing jobs, plus "some way to mark jobs as pending and paused" - and has invited a BEP for it more than once. This BEP is that artefact and deliberately adopts that vocabulary: a durable `waiting` (pending/paused) task and a resume path that observes and decouples through the events backend (delivered as a permission-gated scaffolder route, not the raw events topic webhook - see Resume endpoint and permissions).

### Goals

- Add a durable `waiting` task state to the scaffolder task broker and executor.
- Provide an action-facing `ctx.suspend(...)` primitive that parks the current task and frees its worker.
- Provide an authenticated, permission-gated endpoint to resume a waiting task with a payload.
- Survive process restarts and multiple backend replicas while tasks are waiting.
- Support a declared maximum wait with a defined timeout outcome.
- Emit events and signals for the waiting/resumed transitions so human-facing plugins (notifications and the like) can build on them; core does not send notifications itself.
- Let approvals, wait-for-merge, and wait-for-external-resource be built as modules on top, not as core features.

### Non-Goals

- Building an approval UI, approver-routing policy, or an approval data model into core. Those belong in a plugin (see Release Plan, interim track).
- General DAG / branching workflow orchestration (#23967, closed not-planned as "scaffolder is not a workflow engine"). This BEP introduces no state-machine, branching, or orchestration semantics - only linear suspend/resume of a single task. Orchestration, if ever wanted, can build on this primitive later.
- A coroutine or true in-place continuation model. Resume replays the action handler; it does not resume mid-function.
- Replacing the pull-request-merge gate, which remains right for anything with a Git artifact.

## Proposal

A template author marks a step as gated by writing an action that suspends. Because resume replays the handler from the top, any side-effecting work before the gate must be wrapped in a checkpoint so it runs once, and `ctx.suspend` itself acts as a checkpoint that parks the task on first execution and returns the stored payload on the post-resume replay:

```ts
async handler(ctx) {
  // Runs once. On the replay that follows resume, the memoised id is returned
  // instead of filing a second request.
  const requestId = await ctx.checkpoint({
    key: 'file-approval-request',
    fn: async () => fileApprovalRequest(ctx.input),
  });

  // First execution: parks the task as `waiting` and unwinds. After resume the
  // handler re-runs from the top; this call returns the resume payload.
  const { payload, timedOut, resumedBy } = await ctx.suspend({
    key: requestId,            // caller-owned, unique within the task
    reason: 'awaiting-approval',
    principals: ['group:default/platform-approvers'], // optional; who may resume
    timeout: { hours: 72 },    // optional; omit for no timeout
  });

  if (timedOut) throw new Error('Approval request timed out');
  if (payload.decision !== 'approved') throw new Error('Request declined');
  // provisioning continues here
}
```

An external actor resumes the task through a new scaffolder endpoint:

```
POST /api/scaffolder/v2/tasks/:taskId/resume
{ "key": "<suspension key>", "payload": { "decision": "approved" } }
```

The call is authenticated and gated by a new resource permission (`taskResumePermission`), so "who may resume this task" is a policy decision; the suspending action supplies the context the policy needs (see Resume endpoint and permissions for how core and plugin split this). On a valid, unconsumed key the engine stores the payload, moves the task to `open`, and a worker re-claims it; the suspended action replays and its `suspend` call returns the payload.

Approval is then an ecosystem module: a `wait-for-approval` action that files a record, notifies approvers, and suspends; the approve/decline UI calls the resume endpoint. Core owns the primitive; the plugin owns everything human-facing.

## Design Details

### Task state machine

Add `waiting` to `TaskStatus`. Transitions:

- `processing -> waiting` when the runner completes a park requested by `ctx.suspend`.
- `waiting -> open` on a valid resume signal (see below for why `open`, not `processing`).
- `waiting -> open` on timeout, carrying a `timed_out` outcome on the same record. Timeout is a resume with a different outcome rather than a separate terminal transition, so the action replays and can close whatever it opened before the wait.
- `waiting -> cancelled` on task cancellation.

A `waiting` task holds no worker, so cancellation cannot use the existing in-process worker signal. This needs two changes to existing behaviour: `cancelTask` today only inserts a `cancelled` event and leaves the status alone, relying on the running worker to observe it, and `completeTask` accepts only `processing` as the prior status. Cancelling a parked task therefore becomes a status-guarded update from `waiting`, with `completeTask` accepting `waiting` for the `cancelled` transition. Cancellation is delivered as a status-guarded DB update (`WHERE status = 'waiting'`) plus an emitted event, mirroring the timeout sweep rather than the in-process cancel path. The same transaction consumes the live suspension with `outcome = 'cancelled'`. A cancelled task therefore leaves no live row for the timeout sweep to pick up.

`TaskStatus` is an exported public union in `@backstage/plugin-scaffolder-node` (currently `cancelled | completed | failed | open | processing | skipped`; note `skipped` is a step-level status). Adding `waiting` widens a public type, which is breaking for exhaustive `switch` consumers and requires a changeset and an API-report update. This is not "purely additive" at the type level, only at runtime.

The task table gains the `waiting` status, and suspensions live in their own table rather than inline on the task row, so a task keeps a history of what it waited on:

`scaffolder_task_suspensions`

| column           | notes                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| `id`             | primary key                                                                      |
| `task_id`        | foreign key to `tasks.id`, cascade delete                                        |
| `key`            | caller-owned, unique within a task                                               |
| `reason`         | free-form, surfaced in events and UI                                             |
| `policy_context` | JSON, plugin data; core never evaluates it (see Resume endpoint and permissions) |
| `created_at`     |                                                                                  |
| `expires_at`     | nullable; null means no timeout                                                  |
| `consumed_at`    | nullable; null means live                                                        |
| `outcome`        | nullable: `resumed`, `timed_out` or `cancelled`                                  |
| `payload`        | nullable JSON, the resume payload                                                |
| `resumed_by`     | nullable, the authenticated caller recorded server-side                          |

`UNIQUE (task_id, key)` is the row that concurrent resume calls contend on, and a composite `(consumed_at, expires_at)` index serves the timeout sweep; composite rather than partial, because partial indexes are not portable across the database connectors `backend-defaults` ships. A child table `scaffolder_task_suspension_principals (suspension_id, entity_ref)` holds the entity refs a suspending action declares as able to resume, so permission rules can filter with a plain `IN` rather than a JSON path.

Nothing prunes task rows today, so suspensions live as long as their tasks. `payload` is cleared when the task reaches a terminal state, alongside the existing task-secrets wipe, leaving metadata-sized rows that grow at the same rate as `tasks` and `task_events`.

### Resume is replay, not continuation

There is no coroutine mechanism in the workflow runner. Resume builds on the step-state persistence added in #35224: when `scaffolder.taskRecovery` is enabled, the runner records each completed step's output in task state, and on a rerun it restores those outputs, skips the completed steps and re-enters the first unfinished one. A gated task needs that skip, so `ctx.suspend` requires task recovery to be enabled and throws a configuration error when it is not; a task parked without it would replay every step on resume. On resume the suspended step's handler executes from the top. Therefore:

- `ctx.suspend` is itself a checkpoint: first execution parks the task; the replay after resume returns the stored payload.
- All side-effecting work before `suspend` must be wrapped in `ctx.checkpoint` (or be naturally idempotent), because it re-runs on replay. The idempotency discipline applies to code before the suspend point, not after it.
- The action author sees a normal `await` that returns a payload; the framework hides the park-and-replay.
- The runner serializes the workspace at the park, before the task flips to `waiting`. #35224 serializes only after a successful step, and a park happens mid-step. Without this, `execute` removes the working directory on the way out and the suspended step's files are lost.
- Skipping is per step. An action that suspends inside an `each` replays that step's earlier iterations on resume, so its key must be derived from the iteration. The engine enforces one rule: a consumed suspension is returned at most once per execution run. A second `suspend` with the same key in the same run is a key-reuse error, so a reused key fails loudly and never receives another iteration's outcome.
- A step recorded as failed is not skipped, so it re-runs on resume and the run fails again. Where the original failure was transient, the replay can succeed instead, the run is no longer failing, and a gate behind `${{ failure() }}` is left with a consumed suspension that nothing reads. Gates behind `failure()` suit permanent failures.

This is the same replay-and-skip model task recovery uses after a crash, which is why it composes instead of adding a second execution model.

Because resume replays under whatever is deployed at resume time, a task parked for days is exposed to code and template drift. A `waiting` task pins its serialized task spec and inputs (per BEP-0004's workspace serialization), but not the action _code_, and templates load live from git in many installs. The stance: the task binds to its serialized spec, and resume re-executes the current action implementation; if the action id no longer exists (removed or renamed on a redeploy), resume fails cleanly with a clear error rather than hanging. This is strictly more exposed than a checkpoint-continuation model would be, and it is an accepted trade for reusing the existing replay machinery. Operators who cannot tolerate it should keep waits short.

### Releasing the worker

This is the headline of the design, because "do not hold a worker to wait" is the single most-repeated maintainer objection in this space (freben on the `debug:wait` 30s cap, #24846: "It holds up workers unnecessarily"; the entire #13799 thread). Releasing the slot is the direct answer to it.

`TaskWorker` runs tasks on a bounded `PQueue`; `runOneTask` awaits `workflowRunner.execute(task)` to completion before freeing the slot. Nothing today lets an action yield, and an earlier proposal for a non-blocking worker (#13799) was closed as not planned. So freeing the slot is a real runner change, not additive. `ctx.suspend` records the requested park in memory and unwinds by throwing a dedicated suspend control-signal. Nothing durable happens inside the handler. The runner does the park at its boundary, once the handler has exited by any path. It serializes the workspace, then inserts the suspension row and flips the task `processing -> waiting` in one transaction. Only then does it resolve `execute()`/`runOneTask` and free the `PQueue` slot. This BEP effectively revives #13799's yield, now made durable by persisting `waiting` state rather than holding a slot. If the slot were instead held open for the wait, this would degrade into the rejected poll-a-flag alternative.

Note the scope boundary against #13799: that RFC was rejected for restructuring task _consumption_ from async-poll `claim()` into an event-push model (Rugvip: async polling handles back-pressure and multi-node scaling better). This BEP does not touch consumption at all - task pickup stays `claim()`/poll exactly as today. The only event-driven surface is the inbound resume signal, which is what the maintainers explicitly proposed. This distinction is deliberate: the design leaves the claim/poll consumption model that #13799 was closed to protect entirely untouched.

`runOneTask` completes the task in both directions today: `task.complete('completed', ...)` on a normal return from `workflowRunner.execute`, and `task.complete('failed', ...)` from a blanket `catch`. A suspend signal that escapes `execute` therefore marks the task failed, and one that returns normally marks it completed - the task goes terminal either way and the wait never happens. The runner catches the signal above its step loop and hands back a distinct `WorkflowResponse` variant that `runOneTask` branches on before completing anything, and the suspend path must not run the success-path teardown (`markSuccessful`, workspace cleanup).

The suspend control-signal must not be a plain `Error`, or an action author's `try { await ctx.suspend(...) } catch { }` would swallow it and defeat the park (the same footgun React Suspense has). It is a dedicated non-`Error` sentinel that the runner recognises and re-throws; handlers must not blanket-catch across a `suspend` call. The park is recorded in memory and made durable only at the runner boundary. A swallowed signal is therefore detected the same way on every exit path. If a park was requested and the handler returned normally or threw its own error, the runner fails the step loudly and writes no suspension. The task is never left `waiting` with a failure in flight.

### State transitions, heartbeat, and the stale-task sweeps

The claim query selects only `where status = 'open'`, promoting to `processing`. This is why resume must set the task to `open`, not `processing`: a task written directly to `processing` is owned by no worker and would never be claimed (it would only be picked up much later, and incorrectly, by stale recovery). The Proposal's "a worker re-claims it" depends on the `open` transition.

Two sweeps act on stale tasks, and both filter `status = 'processing'`: `listStaleTasks`/`vacuumTasks` marks lost tasks `failed`, and `recoverTasks` resets stale `processing -> open`. A `waiting` task is excluded from both, which is the core safety property. That property is contingent on the flip to `waiting` and the heartbeat teardown being coordinated. The heartbeat is an in-process interval timer, so it cannot literally enrol in the DB transaction; the mechanism is: the atomic DB write `processing -> waiting` is the ordering point, and the control-signal unwind stops the in-memory heartbeat timer in the worker as it unwinds. Because `heartbeatTask` updates `where status = 'processing'` and throws `ConflictError` on no match, the runner must treat a `ConflictError` from a heartbeat tick that races the flip as expected (the task went `waiting`), not as a lost-task failure. The window between the DB flip and the timer teardown is bounded by one heartbeat interval and is safe precisely because the sweeps only touch `processing`.

### Concurrency and races

The design targets multiple replicas and restarts, so the following must be explicit:

- Resume, consume and re-queue are one transaction holding two guarded compare-and-sets, not a single statement, because the suspension lives in its own table. First `UPDATE scaffolder_task_suspensions SET consumed_at = now(), outcome = 'resumed', payload = ?, resumed_by = ? WHERE task_id = ? AND key = ? AND consumed_at IS NULL`; zero rows rolls the transaction back, and the caller gets 404 for an unknown key or 409 for one already consumed. Then `UPDATE tasks SET status = 'open', last_heartbeat_at = now() WHERE id = ? AND status = 'waiting'`, mirroring `retryTask`; zero rows there means the task was cancelled or swept, and the rollback undoes the consume with it, so the two tables cannot disagree. Nothing is queued in memory: the existing `claim()` poll picks the task up because it is `open`.
- Both statements are compare-and-sets rather than read-then-write, so read committed is sufficient and no explicit row locking is required. PostgreSQL and MySQL serialise contenders on the `(task_id, key)` unique key, and the loser matches zero rows once the winner commits; SQLite serialises writers at the database level.
- Timeout is the mirror image of the same transaction, with `expires_at IS NOT NULL AND expires_at <= now() AND consumed_at IS NULL` on the first statement and `outcome = 'timed_out'`. Resume and timeout therefore compete for the same row and exactly one transaction commits. The sweep also selects only suspensions whose task is still `waiting`. A live row that the cancel transaction missed is then ignored, so it cannot be retried every tick and crowd out real timeouts.
- Ordering contract: the runner serializes the workspace before the transaction that inserts the suspension and flips the task to `waiting`. A resume handled by another replica therefore cannot restore a partial workspace. A resume that arrives before that transaction commits finds nothing to consume and returns 404, and the caller retries.

### Resume endpoint and permissions

New route `POST /v2/tasks/:taskId/resume` on the scaffolder backend. The handler loads the suspension record, authorizes, performs the atomic consume-and-requeue from the Concurrency section, then emits a resumed event on the events backend. To be clear about the maintainer's "events-backend HTTP ingress" phrasing: resume is a permission-gated scaffolder route that emits and observes through the events backend; it is not the generic events-backend topic webhook (`/api/events/http/:topic`), which is unauthenticated per topic and cannot carry the per-resource permission check and atomic token consume this needs.

Authorization is expressed the way the permission framework expects, with a resource permission plus registered rules. `taskResumePermission` is a resource permission on the existing `scaffolder-task` resource type, checked together with `taskReadPermission` exactly as cancel is, so no new resource type is introduced. Because rules are evaluated against whatever the resource ref's `getResources` returns, the task loader is extended to hydrate the live suspension onto the task it returns.

A suspending action may declare `principals`: entity refs allowed to resume, stored in the principals child table. Core registers rules over that data - `SUSPENSION_HAS_PRINCIPAL`, whose `apply` tests membership against the caller's ownership refs and whose `toQuery` filters through the principals table, and `SUSPENSION_HAS_REASON` for routing by gate type - and `IS_TASK_OWNER` is reused unchanged. Core therefore understands only which refs were declared able to resume a given suspension, which is a generic entity-ref concept it already handles; approvers, decisions and workflow meaning stay with the plugin, and `policy_context` remains plugin data that core never evaluates.

`principals` is deliberately optional. Requiring it would put approver routing in core, which this BEP exists to avoid. Omitted, the route enforces only the coarse permission and a consuming plugin authorizes the human decision in its own layer before calling resume; supplied, core can answer whether a caller may resume a particular suspension without the plugin fronting every call. The trade is documented rather than hidden: a suspension with no principals can be resumed by anything holding `taskResumePermission`, so integrators either declare principals or scope that permission to their plugin's service identity. Note also that the scaffolder has no permission-rules extension point today, so a module cannot contribute gate-specific rules without new API; core ships generic rules and a gate expresses its specifics through their params.

The suspension key is an identifier, not a capability. It is caller-owned and often a request id, so it must never be treated as a bearer credential, and knowing a key grants nothing. Authorization rests entirely on `taskResumePermission` and any declared principals. That is why a suspension with no principals can be resumed by anything holding the permission.

Caller identity is server-derived. The route resolves the authenticated principal the same way task creation sets `createdBy` and records it as `resumed_by`; the request payload is opaque plugin data and is never authoritative for identity. Where the decision arrives out of band - Slack, email, a webhook - the calling plugin holds no Backstage credentials for the human it authenticated, so core records the service principal and the plugin's own record holds its verified actor. `resumedBy` is carried on the resumed event and returned to the replayed action alongside the payload.

An inbound third-party webhook is deliberately out of core; a plugin can authenticate an external system and call this route, keeping core authenticated-only.

### Timeout

Timeout is enforced by a scheduled sweep that consumes waiting suspensions whose `expires_at` has passed, records a `timed_out` outcome and returns the task to `open`. It is restart-safe because it is a pure DB predicate with no in-memory timers, and it extends the existing heartbeat/recovery sweep machinery rather than adding a parallel subsystem. The sweep processes a bounded batch per tick, so a mass expiry after an outage cannot queue every parked task at once and head-of-line block ordinary work.

Timeout and resume share one mechanism, and the action observes which one happened: `ctx.suspend` returns `{ timedOut: true }` on a replay that follows a timeout. A consumed suspension always returns its stored outcome on replay rather than parking again, which is what stops a timed-out replay re-parking on the same key; parking again requires a new key.

Because an action author could ignore `timedOut` and continue provisioning after a wait nobody answered, core does not rely on the author here: a replay carrying a timeout outcome forces the suspended step to fail once its handler returns, whatever it returned. Silence therefore cannot approve. Re-parking lifts the force. A handler that observes `timedOut`, notifies again and calls `suspend` with a new key parks normally. The force applies only when the handler returns without parking again. Re-ask and escalation therefore stay inside one step, and a timed-out gate can only finish by waiting again or failing. Forcing the step rather than the task is what makes compensation ordinary: `taskState.failed` flips, and any step whose `if` invokes `${{ failure() }}` or `${{ always() }}` runs, so cleaning up an abandoned gate is template-level work rather than something every gated action must implement.

### Secrets across a long wait

With task recovery enabled, which gated tasks require, #35224 keeps task secrets in the database until the task reaches a terminal state instead of clearing them at claim. A task parked in `waiting` for hours or days therefore holds its secrets for the whole wait, and the tokens they carry may be dead by the time approval lands. This BEP does not solve secret longevity, but it must not pretend the problem away. The stance: secrets captured before a suspend must not be assumed valid after resume; a gated action should re-acquire credentials on resume (the replay model already re-runs the handler, so re-auth fits naturally) rather than rely on a secret captured before the wait. Where re-auth is impossible, the limitation is documented and the timeout should be set below the shortest relevant credential lifetime.

### Observability

Resume emits its own event type rather than reusing `recovered`: `retryTask` inserts `recovered` to tell the frontend to reset, and `trimEventsTillLastRecovery` trims the log at that marker, so reusing it would discard a resumed task's pre-suspend log. Suspension is also not a failure - the suspend path records a `waiting` result on the step tracker and no terminal outcome on the task counter, so a parked task emits no failed-step event and increments no failure metric.

Emit events (`scaffolder.task.waiting`, `scaffolder.task.resumed`, `scaffolder.task.wait-timed-out`) on the events backend so telemetry and notifiers subscribe rather than poll, and emit a signal on the task channel so an open task page live-updates when the decision lands. These are the same primitives adopters already use for provisioning actions.

### User awareness

Making a user aware that something needs their action is deliberately not a core scaffolder concern, and this BEP does not route awareness through the task list. Backstage's canonical "for you" surface is the Notifications plugin (per-user/group inbox + sidebar bell, deep-linkable, optional Slack/email fan-out via first-party processors); the consuming plugin (the approval module, or any gate) sends notifications on suspend and on resume. This matches how comparable human-in-the-loop plugins (e.g. Red Hat's Orchestrator) surface approver awareness today.

The `waiting` task state is therefore an engine concern (worker release, durable pause, recovery), not the mechanism users watch. A gated task must not depend on the task list advertising it as pending - there is no established pattern for that, and `TaskStatus` has no user-facing waiting affordance today. Rendering `waiting` on the task detail page is a nice-to-have shipped in A3, not the awareness path. Live updates via Signals are an enhancement that must degrade gracefully to the next notification/page load, because Signals is still experimental (0.0.x).

### Backwards compatibility, downgrade, and rollback

Forward: templates and actions that never call `suspend` are unaffected. Older frontends encounter an unknown `waiting` status; they treat it as non-terminal (they do not mark the task done), though exact rendering is undefined and a status-to-display map may show it as blank until updated. Shipping the frontend `waiting` affordance in A3 closes this.

Downgrade is the operationally important case, because this feature deliberately parks tasks for days. If a backend is rolled back to a version that does not know `waiting`, parked tasks must not be silently lost. Because the pre-`waiting` claim query and both sweeps only ever touch `open`/`processing`, an older backend simply ignores `waiting` rows (safe, but they become unschedulable until a compatible backend returns). The documented operational path is to drain (resume or cancel) waiting tasks before a rollback, and a migration that can re-open or fail parked tasks. This must be called out in release docs.

### Test plan

- DB migration up/down, including the suspensions table and its principals child table.
- Restart recovery: a `waiting` task survives a backend restart and is not re-run or swept.
- Replay correctness: pre-suspend checkpointed work runs once across suspend/resume.
- Single-consumption: concurrent double-resume yields exactly one enqueue + one 409.
- Resume before the `waiting` record is committed returns 404 and succeeds on the caller's retry.
- Timeout sweep fails an expired waiting task, and loses the race cleanly to a concurrent resume (the status-guarded update makes exactly one of timeout/resume win).
- Permission enforcement on the resume endpoint (allow/deny/conditional).
- Worker-release: a suspended task frees its `PQueue` slot (a second task runs while the first waits).
- Secrets: a gated action re-acquires credentials on resume rather than reusing a pre-suspend secret; a task resumed after its captured secret expired still succeeds.
- Multiple suspension points in one action: two sequential suspends with distinct keys each park and resume once, and the second park does not consume the first record.
- Suspension inside an `each` iteration: iteration-derived keys park and resume independently, checkpoint keys do not collide across iterations, and a second `suspend` with an already-returned key in the same run fails with a key-reuse error.
- Replay after the deployed action code changes between suspend and resume, and a clean failure with a clear error when the action id no longer exists.
- Resume payload size limits are enforced with an explicit rejection rather than a database error, covering anything else written to the task state store.
- Suspension is neither a completion nor a failure: a parked task is not completed or failed by the worker, emits no failed-step event, and records no terminal result on the task and step counters.
- `resumedBy` is derived from the authenticated caller, and a `by` field in the request payload is ignored.
- A timed-out replay cannot finish green: an action that ignores `timedOut` and returns normally still leaves the step failed, and the template's `${{ failure() }}` and `${{ always() }}` steps then run.
- A gate on a `${{ failure() }}` step resumes with the run still failing, and steps that were being skipped stay skipped.
- The workspace survives a park: a resumed task restores the files its earlier steps wrote.
- Cancelling a `waiting` task moves it to `cancelled` through the status-guarded path, with no worker involved, and consumes its suspension so the timeout sweep never selects it.
- A handler that swallows the suspend signal and throws its own error fails the step with no suspension written, and the task is never `waiting`.
- A timed-out replay that notifies again and parks on a new key waits normally and is not forced to fail.
- A resumed task keeps its pre-suspend log: resume does not emit the event type that trims the frontend view.
- With task recovery disabled, `ctx.suspend` throws a configuration error and the task does not park.

## Release Plan

### Core (this BEP)

Staged behind a feature flag, smallest useful first:

- A0. Land this BEP as `implementable`. @spiffaz owns the implementation, and the scaffolder maintainers co-own it as reviewers. Before it merges, reconcile it against #13809, #16622, #23967 and BEP-0004. The step-state persistence and skip it depends on landed in #35224. The SIG still needs to decide whether requiring `scaffolder.taskRecovery` for gated tasks is acceptable, or whether resume from a suspension should trigger the skip with recovery off.
- A1. The primitive: `waiting` status, `ctx.suspend` with worker-release (control-signal unwind), the atomic `processing -> waiting` + heartbeat teardown, the resume route + resource permission, the suspensions table + migration, and a reference `debug:suspend-until-signalled` action (this also addresses the spirit of the 30s `debug:wait` cap, #24846). Concurrency guarantees from Design Details included here, since they are correctness, not polish. `ctx.suspend` accepts `timeout` in A1 but does not enforce it until A2, so an A1 gate can wait indefinitely; the reference action documents this.
- A2. Timeout enforcement (scheduled sweep + declared outcomes) and events + signals wiring.
- A3. Docs (authoring gated actions, the replay/checkpoint discipline, downgrade path) and frontend rendering of the `waiting` state. Graduate out of alpha once the test plan passes and the flag is removed.

### Interim: approval plugin (community-plugins, no core changes)

Buildable today against public extension points and the pragmatic answer for adopters (and for access-grant flows with no MR to merge). The requester's template files an approval record and finishes; on approval a plugin backend launches the provisioning template as a fresh task via the stable `@public` `scaffolderServiceRef.scaffold({ templateRef, values }, { credentials })`, which returns a `taskId`. When the core primitive lands, this one seam swaps "launch a new task" for "call the resume endpoint"; the data model, permissions, and UI are unchanged. The full package breakdown and skeletons live in the companion Track B build plan; it is intentionally kept out of this BEP, which is judged on the core primitive.

## Dependencies

- Persisted step outputs and completed-step skipping, plus `scaffolder.taskRecovery` as stable configuration, landed in #35224, and gated tasks require task recovery to be enabled (see Resume is replay, not continuation). This BEP depends on that capability, not on BEP-0004 reaching a particular status: 0004 remains `provisional` while its implementation graduates from experimental, so gating this design on the document would block it on a process step nobody is waiting on.
- BEP-0004's checkpoints and workspace serialization remain the substrate for idempotency and for restoring a parked task's files, and this design must be co-reviewed with the 0004 owners, since the `waiting` safety property depends on the `status = 'processing'` sweep semantics staying stable.
- Permission framework (resource permission plus registered rules for resume authorization).
- Events backend, Notifications plugin, Signals plugin for the human-facing and observability integration (soft dependencies; the core primitive works without them).

## Drawbacks

- A permanently supported new public surface: a task state, `ctx.suspend`, a REST route, a resource permission, and a DB table, all maintained indefinitely.
- A task can sit in `waiting` unbounded (mitigated by optional timeout). Suspensions live as long as their tasks, since nothing prunes task rows today; clearing `payload` at terminal state keeps the growth metadata-sized.
- The worker-release unwind touches the runner/worker lifecycle, historically sensitive code (#13799 was closed rather than merged).
- The resume endpoint is a new authenticated attack surface guarding sensitive actions; key handling and authorization must be right.
- Gated tasks require `scaffolder.taskRecovery`, so an adopter who keeps recovery off for other reasons has to turn it on to use gates.
- Secrets captured before a wait may expire before resume; gated actions must re-acquire credentials, which not every action can do.

## Alternatives

- Plugin-only, no core change (the #13809 attempt, and the interim track here). This is the predictable "make it a plugin / send it to community-plugins" response (#23967), so it is addressed directly: the interim plugin is the proof that the plugin ceiling is real. A plugin using `scaffolderServiceRef.scaffold` can orchestrate two tasks and drive the engine, but it cannot make the engine release a worker mid-run or persist a durable `waiting` state - those require task-store state only core can own. The interim track degrades to a split-task workaround precisely because of that ceiling, which is the argument for why the primitive belongs in core.
- Beefed-up `debug:wait` that polls a flag inside a long-running action. Holds a worker slot for days, does not survive restarts cleanly, and does not scale past a few concurrent gates - the exact anti-pattern freben rejected on #24846. Rejected here too.
- Full workflow-orchestration engine (#23967) up front. Much larger surface and design risk; linear suspend/resume is the minimal primitive that unblocks the concrete asks, and orchestration can layer on later.
- External durable-workflow engine driving scaffolder from outside (the model Red Hat's Orchestrator plugin takes, on SonataFlow). Powerful but pushes a heavy operator/dependency and a second execution model onto every adopter; keeping the primitive in the task engine keeps one mental model.

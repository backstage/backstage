---
title: Gated Scaffolder Workflows
status: provisional
authors:
  - "@spiffaz"
owners:
  - "@backstage/scaffolder-maintainers"
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
  const { payload, timedOut } = await ctx.suspend({
    token: requestId,          // caller-owned, unique within the task
    reason: 'awaiting-approval',
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
{ "token": "<resume token>", "payload": { "decision": "approved", "by": "user:default/nadia" } }
```

The call is authenticated and gated by a new resource permission (`scaffolderTaskResumePermission`), so "who may resume this task" is a policy decision; the suspending action supplies the context the policy needs (see Resume endpoint and permissions for how core and plugin split this). On a valid, unconsumed token the engine stores the payload, moves the task to `open`, and a worker re-claims it; the suspended action replays and its `suspend` call returns the payload.

Approval is then an ecosystem module: a `wait-for-approval` action that files a record, notifies approvers, and suspends; the approve/decline UI calls the resume endpoint. Core owns the primitive; the plugin owns everything human-facing.

## Design Details

### Task state machine

Add `waiting` to `TaskStatus`. Transitions:

- `processing -> waiting` on `ctx.suspend`.
- `waiting -> open` on a valid resume signal (see below for why `open`, not `processing`).
- `waiting -> failed` on timeout.
- `waiting -> cancelled` on task cancellation.

A `waiting` task holds no worker, so cancellation cannot use the existing in-process worker signal. Both `waiting -> failed` (timeout) and `waiting -> cancelled` are delivered as status-guarded DB updates (`WHERE status = 'waiting'`) plus an emitted event, mirroring the timeout sweep, not the in-process cancel path.

`TaskStatus` is an exported public union in `@backstage/plugin-scaffolder-node` (currently `cancelled | completed | failed | open | processing | skipped`; note `skipped` is a step-level status). Adding `waiting` widens a public type, which is breaking for exhaustive `switch` consumers and requires a changeset and an API-report update. This is not "purely additive" at the type level, only at runtime.

The task table gains the `waiting` status plus a resume-record store (a companion table or a serialized entry consistent with the BEP-0004 context store): `task_id`, `token`, `reason`, `created_at`, `expires_at`, `consumed_at`, `resume_payload`, and `policy_context` (an opaque `JsonObject` the suspending action populates, e.g. declared approvers). `policy_context` is what makes resume authorization meaningful at the core layer - see Resume endpoint and permissions.

### Resume is replay, not continuation

There is no coroutine mechanism in the workflow runner. Completed steps are not re-run (their outputs are persisted in task state); on resume the runner skips them and re-enters the suspended step, whose handler executes from the top. Therefore:

- `ctx.suspend` is itself a checkpoint: first execution parks the task; the replay after resume returns the stored payload.
- All side-effecting work before `suspend` must be wrapped in `ctx.checkpoint` (or be naturally idempotent), because it re-runs on replay. The idempotency discipline applies to code before the suspend point, not after it.
- The action author sees a normal `await` that returns a payload; the framework hides the park-and-replay.

This is the same replay-and-skip model BEP-0004 already uses for crash recovery, which is why it composes instead of adding a second execution model.

Because resume replays under whatever is deployed at resume time, a task parked for days is exposed to code and template drift. A `waiting` task pins its serialized task spec and inputs (per BEP-0004's workspace serialization), but not the action *code*, and templates load live from git in many installs. The stance: the task binds to its serialized spec, and resume re-executes the current action implementation; if the action id no longer exists (removed or renamed on a redeploy), resume fails cleanly with a clear error rather than hanging. This is strictly more exposed than a checkpoint-continuation model would be, and it is an accepted trade for reusing the existing replay machinery. Operators who cannot tolerate it should keep waits short.

### Releasing the worker

This is the headline of the design, because "do not hold a worker to wait" is the single most-repeated maintainer objection in this space (freben on the `debug:wait` 30s cap, #24846: "It holds up workers unnecessarily"; the entire #13799 thread). Releasing the slot is the direct answer to it.

`TaskWorker` runs tasks on a bounded `PQueue`; `runOneTask` awaits `workflowRunner.execute(task)` to completion before freeing the slot. Nothing today lets an action yield, and an earlier proposal for a non-blocking worker (#13799) was closed as not planned. So freeing the slot is a real runner change, not additive: `ctx.suspend` persists state and then unwinds by throwing a dedicated suspend control-signal that the workflow runner catches above its step loop, resolving `execute()`/`runOneTask` cleanly and freeing the `PQueue` slot. This BEP effectively revives #13799's yield, now made durable by persisting `waiting` state rather than holding a slot. If the slot were instead held open for the wait, this would degrade into the rejected poll-a-flag alternative.

Note the scope boundary against #13799: that RFC was rejected for restructuring task *consumption* from async-poll `claim()` into an event-push model (Rugvip: async polling handles back-pressure and multi-node scaling better). This BEP does not touch consumption at all - task pickup stays `claim()`/poll exactly as today. The only event-driven surface is the inbound resume signal, which is what the maintainers explicitly proposed. This distinction is deliberate: the design leaves the claim/poll consumption model that #13799 was closed to protect entirely untouched.

The suspend control-signal must not be a plain `Error`, or an action author's `try { await ctx.suspend(...) } catch { }` would swallow it and defeat the park (the same footgun React Suspense has). It is a dedicated non-`Error` sentinel that the runner recognises and re-throws; handlers must not blanket-catch across a `suspend` call, and the runner should detect a swallowed signal (the handler returning normally when a park was requested) and fail loudly rather than silently continue.

### State transitions, heartbeat, and the stale-task sweeps

The claim query selects only `where status = 'open'`, promoting to `processing`. This is why resume must set the task to `open`, not `processing`: a task written directly to `processing` is owned by no worker and would never be claimed (it would only be picked up much later, and incorrectly, by stale recovery). The Proposal's "a worker re-claims it" depends on the `open` transition.

Two sweeps act on stale tasks, and both filter `status = 'processing'`: `listStaleTasks`/`vacuumTasks` marks lost tasks `failed`, and `recoverTasks` resets stale `processing -> open`. A `waiting` task is excluded from both, which is the core safety property. That property is contingent on the flip to `waiting` and the heartbeat teardown being coordinated. The heartbeat is an in-process interval timer, so it cannot literally enrol in the DB transaction; the mechanism is: the atomic DB write `processing -> waiting` is the ordering point, and the control-signal unwind stops the in-memory heartbeat timer in the worker as it unwinds. Because `heartbeatTask` updates `where status = 'processing'` and throws `ConflictError` on no match, the runner must treat a `ConflictError` from a heartbeat tick that races the flip as expected (the task went `waiting`), not as a lost-task failure. The window between the DB flip and the timer teardown is bounded by one heartbeat interval and is safe precisely because the sweeps only touch `processing`.

### Concurrency and races

The design targets multiple replicas and restarts, so the following must be explicit:

- Resume, consume, and re-queue are one atomic conditional update guarded on both token and status: `UPDATE ... SET consumed_at = now(), status = 'open' WHERE task_id = ? AND token = ? AND consumed_at IS NULL AND status = 'waiting'`. (The token is unique only within a task, so the row is keyed by `task_id` + `token`, which the `/tasks/:taskId/resume` route provides.) The enqueue happens only if that update affects exactly one row. Guarding on `status = 'waiting'` (not just `consumed_at IS NULL`) is what makes resume and timeout genuinely mutually exclusive: whichever flips the row out of `waiting` first wins, and the loser's conditional update matches zero rows. A second resume with the same token matches zero rows and returns 409. Timeout is the same shape (`... SET status = 'failed' WHERE token = ? AND status = 'waiting'`), so the two compete on the one row.
- Ordering contract: `suspend` must commit the `waiting` record before any resume is accepted. A resume that arrives before the record exists finds nothing to authorize or consume and returns 404; the caller (the webhook-owning plugin, out of core) retries. This keeps core from carrying pre-commit-resume complexity for a case core does not own, at the cost of requiring the external caller to retry - an acceptable trade because the resume is inherently a plugin/webhook concern.

### Resume endpoint and permissions

New route `POST /v2/tasks/:taskId/resume` on the scaffolder backend, plus `scaffolderTaskResumePermission` registered as a resource permission. The handler loads the resume record first, then authorizes, then performs the atomic consume-and-requeue from the Concurrency section, then emits `scaffolder.task.resumed` on the events backend. To be clear about the maintainer's "events-backend HTTP ingress" phrasing: resume is a permission-gated scaffolder route that emits and consumes through the events backend for observability and decoupling; it is not the generic events-backend topic webhook (`/api/events/http/:topic`), which is unauthenticated per-topic and cannot carry the per-resource permission check and atomic token consume this needs. The events backend is how the transition is observed, not how the route is authenticated.

Resume authorization is split by layer, which resolves what core can actually enforce. Core stores no domain concepts like approvers; it stores the opaque `policy_context` the suspending action wrote. So core enforces a coarse `scaffolderTaskResumePermission` and passes `policy_context` (and task metadata) to the `PermissionPolicy` as conditional resource context. The consuming plugin's policy is what interprets `policy_context.approvers` and decides. This is honest about the boundary: core provides the gated route and the context channel; the plugin owns the meaning of "who may approve this."

An inbound third-party webhook is deliberately out of core; a plugin can authenticate an external system and call this route, keeping core authenticated-only.

### Timeout

Timeout is enforced by a scheduled sweep that periodically fails waiting tasks whose `expires_at` has passed. It is restart-safe because it is a pure DB predicate with no in-memory timers. Rather than a parallel subsystem, this extends the existing heartbeat/recovery sweep machinery (the same infrastructure behind `EXPERIMENTAL_recoverTasks` / `EXPERIMENTAL_recoverTasksTimeout`), adding an `expires_at` predicate for `waiting` rows alongside the existing stale-`processing` predicates.

### Secrets across a long wait

BEP-0004 already flags that task secrets are persisted in the DB and wiped on completion, and that they can expire. A task parked in `waiting` for hours or days makes this concrete: the token a later provisioning step needs may be dead by the time approval lands. This BEP does not solve secret longevity, but it must not pretend the problem away. The stance: secrets captured before a suspend must not be assumed valid after resume; a gated action should re-acquire credentials on resume (the replay model already re-runs the handler, so re-auth fits naturally) rather than rely on a secret captured before the wait. Where re-auth is impossible, the limitation is documented and the timeout should be set below the shortest relevant credential lifetime.

### Observability

Emit events (`scaffolder.task.waiting`, `scaffolder.task.resumed`, `scaffolder.task.wait-timed-out`) on the events backend so telemetry and notifiers subscribe rather than poll, and emit a signal on the task channel so an open task page live-updates when the decision lands. These are the same primitives adopters already use for provisioning actions.

### User awareness

Making a user aware that something needs their action is deliberately not a core scaffolder concern, and this BEP does not route awareness through the task list. Backstage's canonical "for you" surface is the Notifications plugin (per-user/group inbox + sidebar bell, deep-linkable, optional Slack/email fan-out via first-party processors); the consuming plugin (the approval module, or any gate) sends notifications on suspend and on resume. This matches how comparable human-in-the-loop plugins (e.g. Red Hat's Orchestrator) surface approver awareness today.

The `waiting` task state is therefore an engine concern (worker release, durable pause, recovery), not the mechanism users watch. A gated task must not depend on the task list advertising it as pending - there is no established pattern for that, and `TaskStatus` has no user-facing waiting affordance today. Rendering `waiting` on the task detail page is a nice-to-have shipped in A3, not the awareness path. Live updates via Signals are an enhancement that must degrade gracefully to the next notification/page load, because Signals is still experimental (0.0.x).

### Backwards compatibility, downgrade, and rollback

Forward: templates and actions that never call `suspend` are unaffected. Older frontends encounter an unknown `waiting` status; they treat it as non-terminal (they do not mark the task done), though exact rendering is undefined and a status-to-display map may show it as blank until updated. Shipping the frontend `waiting` affordance in A3 closes this.

Downgrade is the operationally important case, because this feature deliberately parks tasks for days. If a backend is rolled back to a version that does not know `waiting`, parked tasks must not be silently lost. Because the pre-`waiting` claim query and both sweeps only ever touch `open`/`processing`, an older backend simply ignores `waiting` rows (safe, but they become unschedulable until a compatible backend returns). The documented operational path is to drain (resume or cancel) waiting tasks before a rollback, and a migration that can re-open or fail parked tasks. This must be called out in release docs.

### Test plan

- DB migration up/down, including the resume-record store.
- Restart recovery: a `waiting` task survives a backend restart and is not re-run or swept.
- Replay correctness: pre-suspend checkpointed work runs once across suspend/resume.
- Single-consumption: concurrent double-resume yields exactly one enqueue + one 409.
- Resume before the `waiting` record is committed returns 404 and succeeds on the caller's retry.
- Timeout sweep fails an expired waiting task, and loses the race cleanly to a concurrent resume (the status-guarded update makes exactly one of timeout/resume win).
- Permission enforcement on the resume endpoint (allow/deny/conditional).
- Worker-release: a suspended task frees its `PQueue` slot (a second task runs while the first waits).
- Secrets: a gated action re-acquires credentials on resume rather than reusing a pre-suspend secret; a task resumed after its captured secret expired still succeeds.

## Release Plan

### Core (this BEP)

Staged behind a feature flag, smallest useful first:

- A0. Land this BEP as `provisional`, socialise in the scaffolder SIG / Discord, secure a maintainer co-owner, converge the API shape, and reconcile against #13809, #16622, #23967 and BEP-0004. The SIG must make one explicit sequencing decision here (see Dependencies): either (a) A1 lands behind an experimental flag and cannot graduate until BEP-0004's recovery + serialization are GA - accepting an indefinitely-alpha primitive - or (b) the minimal 0004 surface this actually needs is identified and stabilised first. This is the most likely "not yet"; put the decision to the SIG rather than defer it. Move to `implementable`.
- A1. The primitive: `waiting` status, `ctx.suspend` with worker-release (control-signal unwind), the atomic `processing -> waiting` + heartbeat teardown, the resume route + resource permission, resume-record store + migration, and a reference `debug:suspend-until-signalled` action (this also addresses the spirit of the 30s `debug:wait` cap, #24846). Concurrency guarantees from Design Details included here, since they are correctness, not polish. `ctx.suspend` accepts `timeout` in A1 but does not enforce it until A2, so an A1 gate can wait indefinitely; the reference action documents this.
- A2. Timeout enforcement (scheduled sweep + declared outcomes) and events + signals wiring.
- A3. Docs (authoring gated actions, the replay/checkpoint discipline, downgrade path) and frontend rendering of the `waiting` state. Graduate out of alpha once the test plan passes and the flag is removed.

### Interim: approval plugin (community-plugins, no core changes)

Buildable today against public extension points and the pragmatic answer for adopters (and for access-grant flows with no MR to merge). The requester's template files an approval record and finishes; on approval a plugin backend launches the provisioning template as a fresh task via the stable `@public` `scaffolderServiceRef.scaffold({ templateRef, values }, { credentials })`, which returns a `taskId`. When the core primitive lands, this one seam swaps "launch a new task" for "call the resume endpoint"; the data model, permissions, and UI are unchanged. The full package breakdown and skeletons live in the companion Track B build plan; it is intentionally kept out of this BEP, which is judged on the core primitive.

## Dependencies

- BEP-0004 task idempotency (checkpoints, workspace serialization, recover-on-restart) is the substrate. It is itself still `provisional` and its recovery lives behind an experimental flag; this design must be co-reviewed with the 0004 owners and should not graduate until 0004's recovery + serialization are GA and their `status = 'processing'` sweep semantics are stable, since the `waiting` safety property depends on them.
- Permission framework (resource permission for resume authorization).
- Events backend, Notifications plugin, Signals plugin for the human-facing/observability integration (soft dependencies; the core primitive works without them).

## Drawbacks

- A permanently supported new public surface: a task state, `ctx.suspend`, a REST route, a resource permission, and a DB table, all maintained indefinitely.
- A task can sit in `waiting` unbounded (mitigated by optional timeout); the resume-record table grows and needs retention.
- The worker-release unwind touches the runner/worker lifecycle, historically sensitive code (#13799 was closed rather than merged).
- The resume endpoint is a new authenticated attack surface guarding sensitive actions; token handling and authorization must be right.
- Coupling to BEP-0004's not-yet-GA internals is a real sequencing risk.
- Secrets captured before a wait may expire before resume; gated actions must re-acquire credentials, which not every action can do.

## Alternatives

- Plugin-only, no core change (the #13809 attempt, and the interim track here). This is the predictable "make it a plugin / send it to community-plugins" response (#23967), so it is addressed directly: the interim plugin is the proof that the plugin ceiling is real. A plugin using `scaffolderServiceRef.scaffold` can orchestrate two tasks and drive the engine, but it cannot make the engine release a worker mid-run or persist a durable `waiting` state - those require task-store state only core can own. The interim track degrades to a split-task workaround precisely because of that ceiling, which is the argument for why the primitive belongs in core.
- Beefed-up `debug:wait` that polls a flag inside a long-running action. Holds a worker slot for days, does not survive restarts cleanly, and does not scale past a few concurrent gates - the exact anti-pattern freben rejected on #24846. Rejected here too.
- Full workflow-orchestration engine (#23967) up front. Much larger surface and design risk; linear suspend/resume is the minimal primitive that unblocks the concrete asks, and orchestration can layer on later.
- External durable-workflow engine driving scaffolder from outside (the model Red Hat's Orchestrator plugin takes, on SonataFlow). Powerful but pushes a heavy operator/dependency and a second execution model onto every adopter; keeping the primitive in the task engine keeps one mental model.

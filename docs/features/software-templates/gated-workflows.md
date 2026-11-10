---
title: Gated workflows
description: Suspend a template task until a manual decision or an event arrives.
---

# Gated workflows

Gated workflows are an experimental feature based on BEP-0018. Use `resumeOn`
to declare the triggers that can resume a suspended task. The API may change.

## Enable gated workflows

Enable task recovery and configure a workspace provider. For example, use the
existing database workspace module. See
[task recovery configuration](./configuration.md#task-recovery).

```yaml
scaffolder:
  taskRecovery:
    enabled: true
    workspaceProvider: database
  gatedWorkflows:
    eventTopics:
      - github.pull_request
```

Install the existing Events backend and the GitHub Events module to receive
signed GitHub webhooks. The GitHub module publishes `github.pull_request`
events. Scaffolder receives these events through Backstage Events.

`eventTopics` is an operator-controlled allowlist. A template cannot wait on
a topic outside this list. The backend subscribes at startup. It also restores
topics for live waits from the database.

## Suspension options

`workflow:suspend` and `ctx.suspend(...)` accept the same options. A template
supplies them as action input. A custom action passes them to `ctx.suspend(...)`.
Both paths use the same runtime validation.

| Option     | Purpose                                                                             |
| ---------- | ----------------------------------------------------------------------------------- |
| `key`      | Identifies the suspension within the task and retrieves its saved result on replay. |
| `reason`   | Optional text that explains why the task is waiting.                                |
| `resumeOn` | Lists the manual and event triggers. The first accepted trigger resumes the task.   |
| `timeout`  | Optional maximum wait duration. Expiry returns a timeout result.                    |

## Suspend from a template

```yaml
steps:
  - id: before
    action: debug:log
    input:
      message: Before the wait

  - id: gate
    action: workflow:suspend
    input:
      key: review
      reason: Waiting for a manual decision or a merged pull request
      resumeOn:
        - id: manual
          type: manual
          principals:
            - group:default/platform-approvers
        - id: merged
          type: event
          topic: github.pull_request
          match:
            action: closed
            pull_request:
              merged: true
              html_url: https://github.com/acme/service/pull/42
      timeout:
        days: 3

  - id: after
    action: debug:log
    input:
      message: Resumed by ${{ steps.gate.output.triggerId }}
```

The first accepted trigger resumes the task. Each trigger needs a unique `id`.
The suspension `key` must be unique within the task. It is an identifier, not
a credential. Use a key derived from the iteration when an action uses `each`.

`match` is a partial object match against `eventPayload`. Every named property
must exist and match. Extra object properties are allowed. Arrays must have
the same length and match in order. This supports plain JSON values and does
not evaluate expressions or JavaScript.

The action returns `triggerId` and `payload`. A manual trigger means that an
authorized caller supplied a result. It does not interpret that result as an
approval. An approval action must check the decision before it provisions a
resource.

## Resume a manual trigger

```http
POST /api/scaffolder/v2/tasks/TASK_ID/resume
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "key": "review",
  "triggerId": "manual",
  "payload": { "decision": "approved" }
}
```

The route requires user credentials, `taskReadPermission`, and
`taskResumePermission`. If `principals` is declared, the user or one of their
ownership entity references must match it. The backend derives the actor from
the authenticated credentials. Payload fields cannot set that identity.

If `principals` is omitted, the task permissions control access. A manual
request cannot satisfy an event trigger. An unknown key returns 404. A wait
that has already been consumed, cancelled, or expired cannot be resumed and
returns 409. Trigger definitions and resume payloads have a maximum serialized
string length of 65,536.

## Suspend from an action

```ts
const requestId = await ctx.checkpoint({
  key: 'request',
  fn: async () => createApprovalRequest(ctx.input),
});

const result = await ctx.suspend({
  key: requestId,
  resumeOn: [
    {
      id: 'decision',
      type: 'manual',
      principals: ['group:default/platform-approvers'],
    },
  ],
  timeout: { days: 3 },
});

if (result.timedOut) throw new Error('Approval timed out');
if (result.payload.decision !== 'approved') throw new Error('Request declined');
```

The initial call parks the task and releases its worker. Resume runs the
suspended handler again from the beginning. Completed steps are skipped and
side effects saved by checkpoints are reused. The resumed `suspend` call returns the
saved result. The workspace is saved before the task becomes `waiting`.

Do not catch the suspension control signal. If a handler catches it and
returns or throws another error, the task fails without creating a wait.
Do not use `suspend` inside a checkpoint function. Put checkpoints around
the side effects before the suspension instead.

An action can wait again with a new key after a timeout. If it returns without
waiting again, the runner fails the timed-out step even when the action ignores
`timedOut`. Normal `failure()` and `always()` template steps can do cleanup.

## Current limits

- Timeout processing uses the existing recovery loop. Expiry is checked when
  that loop runs, rather than by a timer held for each task.
- Backstage Events does not guarantee event consumption. A matching event
  received before the wait is committed is not saved for that wait. Missed
  events are not reconciled against GitHub. Set a timeout or
  include a manual trigger when testing this behavior.
- Matching uses the topic and payload. The default remote Events transport
  does not preserve metadata.
- An event resume records the Scaffolder service as the actor. It does not
  impersonate a GitHub user.
- User credentials can expire while a task waits. Use current integration
  credentials for work after a gate.
- Resume uses the current deployed action implementation. The task specification
  and workspace are saved, but action code is not pinned.
- Resume or cancel waiting tasks before rolling back to a backend without this
  feature. The down migration refuses to remove live wait storage.
- Retry of a terminal task starts new waits for unfinished steps. Old suspension
  records are removed on retry. Resume payloads are cleared when a task becomes
  terminal. Values emitted as action outputs follow normal task history
  retention.

This experimental feature has no approval inbox, notification routing, custom trigger
provider registry, or automatic recovery of missed external events.

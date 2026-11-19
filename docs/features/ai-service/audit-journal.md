---
id: ai-service-audit-journal
title: The AI Service Audit Journal
sidebar_label: Audit journal
description: What the append-only decision journal records, what it deliberately does not, and how crash recovery works
---

Every dispatch decision the AI service makes is written to an append-only
_journal_ before the request leaves the process. This page explains what
the journal records, what it deliberately does not, and how it behaves
when things go wrong.

## What is recorded

For each model or tool attempt, the journal records the decision and its
reason, the attempt identity (session, conversation, plugin, provider,
model or tool), and the outcome once it settles: completed, failed, or
cancelled. An attempt whose outcome cannot be determined settles as
_uncertain_ with a recovery row documenting what was known when the
process lost track of it — a transport that failed before headers, an
outcome write that itself failed, or a stream that never finished.

Denials are journaled too, with the reason expressed in a closed internal
vocabulary — never with policy-derived text or caller-supplied content.
Audit reads through `GET /sessions/:sessionId/audit` require both session
ownership and the `ai.audit.read` permission, and are scoped to the
session.

Rows are retained on a schedule and pruned by age, driven by the
backend's scheduler. Recovery rows are protected from pruning until they
age out like every other row.

## What is deliberately not recorded

The journal records decisions and outcomes, not content:

- No prompts, completions, tool inputs, or tool outputs.
- No credential material — nowhere in the journal, at any column.
- No command content for local tool dispatches (see
  [Extending](./extending.md#tool-servers)): the audit boundary there is
  identity-only, because free text cannot be proven secret-free.

This is a privacy feature, not a limitation of the implementation. It
means the journal can be retained, exported, and audited without becoming
a store of what your users said to which model. The flip side is
accountability without reproducibility: an incident review can establish
_that_ an authorized, fenced call happened and how it settled, but cannot
replay what was sent.

The journal is append-only and written before dispatch. It is not
tamper-auditable: there is no hash chaining or signing. Treat it as a
durable decision record within the trust boundary of your database, not
as evidence against a hostile database administrator.

## Crash recovery

The deny-before-execute ordering is the core invariant: a decision row
exists before the request is sent, so a process that dies mid-dispatch
leaves an intent whose outcome is unknown, never an unjournaled send. On
restart, unresolved intents are documented as uncertain outcomes with
recovery rows; admitted durable work is never cancelled by a restart.
Crash recovery is verified by test cells that kill worker processes
mid-dispatch on both database dialects.

The same construction covers the local tool kind: a process death between
the pre-execution decision and the local function's settlement leaves
exactly the unresolved-intent shape the journal already recovers.

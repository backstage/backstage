---
'@backstage/ai-node-shell': minor
---

## @backstage/ai-node-shell

A reference **local** tool server for the managed AI service: one `run` tool that executes a command line on the backend host.

It is unsandboxed by design and opt-in. The command comes from the model and runs through the host shell with the backend process's own identity, so it can read and write whatever that process can, reach the network and spawn further processes; there is no allowlist, no command filtering and no argument validation, because raw is the point. The guardrails are process-level: the attempt is authorized against `ai.tool.use` with the caller's own credentials before anything runs, the session fence and credential generation are rechecked, the decision and outcome are journaled, and a denial means nothing executes. A command that exits non-zero reports a failed outcome with its output, and one that outlives `timeoutMs` is killed and reported as cancelled.

The audit boundary is identity-level, stated plainly: invocations are journaled per attempt by tool identity, session, acting principal, decision and outcome, and **command content is never journaled** — free text cannot be proven secret-free, so it stays out of the journal entirely, the same discipline that keeps prompts and payloads out. That is accountability without reproducibility: the trail proves who ran a tool under which decision, not what the command was, so an incident review cannot replay it. A deployment that needs command-level audit should build a scoped tool with structured, validated arguments instead of registering this one.

`createRawShellToolModule` takes the shell, working directory, timeout, output ceiling and extra environment; `rawShellToolModule` is the zero-configuration registration.

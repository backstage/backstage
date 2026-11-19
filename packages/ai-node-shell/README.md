# @backstage/ai-node-shell

Reference raw shell tool server for the Backstage managed AI service.

The managed AI service (`@backstage/ai-node`) mediates tool dispatch through
one seam: a registered tool server is authorized per attempt against
`ai.tool.use` with the caller's own credentials, fenced to the session, and
recorded in the journal. Most tool servers dispatch over HTTP; the seam also accepts a
**local** server, whose dispatch runs a host function in process.

This package is the reference local server: one `run` tool that executes a
command line on the backend host. It exists to be an honest example, not a
default.

## This gives the model a shell

```ts
import { createAiServiceFactory, aiServiceRef } from '@backstage/ai-node/alpha';
import { createRawShellToolModule } from '@backstage/ai-node-shell/alpha';

const factory = createAiServiceFactory({
  toolModules: [
    createRawShellToolModule({
      cwd: '/tmp/workspace',
      timeoutMs: 60_000,
    }),
  ],
})(aiServiceRef);
```

A harness reaches the tool only if it asks for the `tools` feature and the
policy allows `ai.tool.use` for `{ serverId: 'shell', toolName: 'run' }` with
that plugin's `pluginId`. Register the module only when the deployment means
to give the model a shell.

## What the guardrails are — and are not

There is no sandbox and no command filtering. The command arrives from the
model as a string and runs through the host shell with the backend process's
own identity: it can read and write whatever that process can, reach the
network, and spawn further processes. The guardrails that do apply are
process-level:

- the attempt is authorized against `ai.tool.use` with the caller's
  credentials, evaluated in process against the policy's conditions, before
  the command starts;
- the session fence and the credential generation are rechecked, so a revoked
  or superseded authority stops the next command;
- the decision and the outcome are recorded in the journal, and a denial means nothing
  executes.

`run` accepts `{ command, stdin? }`; a non-zero exit reports a `failed`
outcome with the captured output, and a command that outlives `timeoutMs` is
killed and reported as `cancelled`.

## The audit boundary: identity, not content

Shell invocations are authorized, fenced, and recorded in the journal **by
identity** per
attempt — `serverId`/`toolName`, the session, the acting principal, the
decision and the outcome — and **command content never reaches the
journal**. Free
text cannot be proven secret-free, so it stays out of the journal entirely,
the same discipline that keeps prompts and response payloads out: a command
that echoes a token never puts that token in the audit trail. The journal row
for a local call has no destination, because there is no request.

That trade-off is deliberate and it is worth stating plainly:

- **accountability without reproducibility.** The trail proves who ran a tool,
  in which session, under which decision, with which outcome. It does not
  preserve what the command was, so an incident review cannot replay it.
- **A deployment that needs command-level audit should not use this tool.**
  Build a scoped tool with structured arguments instead: a fixed set of
  operations, each with validated parameters, dispatching through
  `createRawShellToolModule`-style host code but passing only structured values
  the journal can carry safely — for example a `{ subcommand: 'list', path }`
  tool whose arguments are validated against a closed vocabulary before the
  host code runs.

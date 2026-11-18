# @backstage/ai-node-codemode

Default code mode construction for the Backstage managed AI service.

The managed AI service (`@backstage/ai-node`) supports an opt-in code mode:
Pi's `codemode` extension runs model-written JavaScript in a QuickJS sandbox
whose script survives restarts by deterministic replay. The service core
carries no sandbox implementation of its own — the `codemode` option accepts
a host-supplied extension factory, and this package provides the default
construction for it.

## Usage

```ts
import { createPrivateAiService } from '@backstage/ai-node/alpha';
import { createBoundedCodemodeExtension } from '@backstage/ai-node-codemode/alpha';

const service = await createPrivateAiService({
  deps,
  config,
  codemode: {
    timeoutMs: 60_000,
    createExtension: createBoundedCodemodeExtension,
  },
});
```

`createBoundedCodemodeExtension` builds the `codemode` extension over a
sandbox whose `start()` enforces a host wall-clock ceiling per script
execution:

- `timeoutMs` is the host ceiling, in milliseconds, per script execution
  including time spent in tools. A script's own
  `// @options: {"timeout_ms": ...}` line may lower it, never exceed it.
  Defaults to 300000.
- `memoryLimitBytes` bounds the QuickJS heap. Defaults to no explicit limit.

## Isolation, limits, and audit posture

- Scripts see only their tools and Pi's script globals — no network,
  filesystem, timers, `process`, or modules. Script output is capped at
  16777216 characters (UTF-16 code units) / 100000 items, a single store
  value at 262144 characters, and all of a run's store writes combined at
  1048576 characters.
- The deadline is wall-clock only and does not enter the durable start
  data, so it cannot affect replay: a script may lower it through its own
  `// @options: {"timeout_ms": ...}` line, never raise it above the host's.
- A script survives restarts by deterministic replay: one journal commit
  plus one count commit per delivered nested result, stored in the
  conversation's durable storage. That bookkeeping is separate from the
  AI audit journal: model calls made from inside scripts (the `models.*`
  globals) leave per-attempt AI audit rows — permission, fence, and
  credential recheck, journaled before send — while script bookkeeping
  itself does not.

The long-form contract is the `AiCodemodeOptions` TSDoc in
`@backstage/ai-node/alpha` and the header of the core integration suite
`packages/ai-node/src/codemode.test.ts`, which pins each check.

## Installation

```bash
yarn add @backstage/ai-node-codemode
```

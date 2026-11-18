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
  `// @options {"timeout_ms": ...}` may lower it, never exceed it. Defaults
  to 300000.
- `memoryLimitBytes` bounds the QuickJS heap. Defaults to no explicit limit.

Scripts see only their tools and Pi's script globals — no network,
filesystem, timers, `process`, or modules — and model calls from inside
scripts route through the service's guarded facade like any other dispatch.
See the `@backstage/ai-node` README for the full isolation and audit
contract.

## Installation

```bash
yarn add @backstage/ai-node-codemode
```

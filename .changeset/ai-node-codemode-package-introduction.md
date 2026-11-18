---
'@backstage/ai-node-codemode': minor
---

Added a new `@backstage/ai-node-codemode` package: the default code mode construction for the managed AI service. The service's opt-in `codemode` option takes a host-supplied `createExtension` callback — the core resolves the limits, appends the returned extension to the caller's registry selection, and closes the returned sandbox with the harness — and this package provides that construction: `createBoundedCodemodeExtension` builds Pi's `codemode` extension over a sandbox whose script runs enforce a host wall-clock ceiling (a script's own `// @options: {"timeout_ms": ...}` line may lower it, never exceed it) with an optional QuickJS heap limit. The core package itself no longer depends on the sandbox runtime. The surface is alpha, exposed from `@backstage/ai-node-codemode/alpha`.

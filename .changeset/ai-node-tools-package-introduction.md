---
'@backstage/ai-node-tools': minor
---

Added a new `@backstage/ai-node-tools` package: the host-side tool composition surface for the managed AI service. `createToolPermissions` registers one basic Backstage permission per declared tool — named `ai.tool.<server>.<tool>.use` under the same exact-name rule as model permissions — and returns an authorize helper that maps tool identities back to permission decisions under the caller's credentials. The service-side enforcement (the guarded, journaled tool dispatch) stays in `@backstage/ai-node`, which the default service factory itself consumes; this package carries what hosts compose themselves. The surface is alpha, exposed from `@backstage/ai-node-tools/alpha`.

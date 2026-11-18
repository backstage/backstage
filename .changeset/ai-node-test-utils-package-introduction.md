---
'@backstage/ai-node-test-utils': minor
---

Added a new `@backstage/ai-node-test-utils` package with the test utilities provider-module authors use to certify modules against the managed AI service's guard: the provider certification registrar, the provider registry, the guard and journal constructors for suites that drive the guard directly, the crash fixture and journal harness for crash-certification and journal-row assertions, and a fixture registry of synthetic provider module copies. The package replaces the former `@backstage/ai-node/testUtils` entry point, which is removed; the certification and guard-construction machinery it re-exports is published on the `@backstage/ai-node` module-authoring entry point (`@backstage/ai-node/modules`), which now carries the module and auth module contracts, the request-envelope validator, the OAuth token-request helpers, and that machinery.

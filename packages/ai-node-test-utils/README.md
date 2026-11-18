# @backstage/ai-node-test-utils

Test utilities for certifying provider modules against the managed AI service's
guard. Provider-module authors use this package in their test suites; it
carries no runtime code for hosts.

## What it carries

- **Certification registrar** — `registerProviderCertification` runs a
  module's declared destination shapes through the real guard and fails any
  dispatch that deviates from the declared envelope.
- **Provider registry** — `createProviderRegistry` builds the immutable
  registry a certification or harness dispatches through.
- **Guard constructors** — `createModelOperationGuard` and
  `createGuardedModelOperations`, plus the journal constructor
  `createAttemptJournal`, for suites that drive the guard directly.
- **Crash fixture** — `createCrashTestFixture`, `runCrashChild`, and the
  `CRASH_TEST_*` environment constants, for crash-certification suites that
  kill a dispatch mid-flight and assert the durable journal's uncertainty
  record.
- **Journal harness** — `createJournalHarness` provisions a migrated database
  and leased namespace for suites that assert on journal rows.
- **Fixture registry** — `builtinProviderRegistry` and
  `fixtureProviderModules`, synthetic copies of the extracted provider
  families, for tests that dispatch through a realistic registry without
  depending on a family package.

The entry point is `@backstage/ai-node-test-utils/alpha`. The contracts,
envelope validator, and token-request helpers these build on live on the
module-authoring entry point, `@backstage/ai-node/modules`.

## Installation

```bash
# From your Backstage backend root directory
yarn add --dev @backstage/ai-node-test-utils
```

## Usage

A provider package's certification suite registers against the real guard:

```ts
import { anthropicMessages } from './anthropicMessages';
import {
  createProviderRegistry,
  registerProviderCertification,
} from '@backstage/ai-node-test-utils/alpha';

registerProviderCertification({
  name: 'anthropic-messages',
  operation: 'streamSimple',
  modules: createProviderRegistry([anthropicMessages]),
  // ...operation and request builders per the module's declared destinations
});
```

Crash certification uses the fixture:

```ts
import { createCrashTestFixture } from '@backstage/ai-node-test-utils/alpha';
```

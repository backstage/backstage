/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createAiModuleRegistry } from './moduleRegistry';
import { fixtureProviderModules } from '@backstage/ai-node-test-utils/alpha';

const fixtureAnthropicMessages = fixtureProviderModules.find(
  module => module.id === 'anthropic-messages',
)!;
import { validateToolCallEnvelope } from './tools/envelope';
import type { ToolModule } from './tools/types';

it('validates registrations atomically and preserves previous snapshots', () => {
  const registry = createAiModuleRegistry({
    providerModules: [fixtureAnthropicMessages],
    toolModules: [],
  });
  const tool: ToolModule = {
    id: fixtureAnthropicMessages.id,
    tools: [{ name: 'search' }],
    destination: name => `https://tools.example/mcp/server/tools/${name}`,
    destinationTemplates: [
      [
        { literal: '/mcp/' },
        { digest: 'server' },
        { literal: '/tools/' },
        { digest: 'tool' },
      ],
    ],
    validateToolCall: validateToolCallEnvelope,
    adapter: {
      kind: 'tool',
      invoke: async () => ({ value: null, outcome: 'failed' }),
    },
  };
  const before = registry.snapshot();
  expect(() =>
    registry.registerProviderModules([fixtureAnthropicMessages]),
  ).toThrow();
  expect(() => registry.registerToolModules([tool])).toThrow(/collision/i);
  registry.registerToolModules([{ ...tool, id: 'tools' }]);
  expect(before.toolModules).toHaveLength(0);
  expect(registry.snapshot().toolModules).toHaveLength(1);
  expect(() =>
    registry.registerProviderModules([
      { ...fixtureAnthropicMessages, id: 'tools' },
    ]),
  ).toThrow(/collision/i);
  expect(registry.snapshot().providerModules).toHaveLength(1);
});

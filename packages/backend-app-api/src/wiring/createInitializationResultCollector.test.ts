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

import { createInitializationResultCollector } from './createInitializationResultCollector';

describe('createInitializationResultCollector', () => {
  it('should include init begin timestamps when they were reported', () => {
    const collector = createInitializationResultCollector({
      pluginIds: ['plugin1'],
      allowBootFailurePredicate: () => false,
    });

    collector.onPluginModuleInitBegin('plugin1', 'module1');
    collector.onPluginModuleResult('plugin1', 'module1');
    collector.onPluginInitBegin('plugin1');
    collector.onPluginResult('plugin1');

    const result = collector.finalize();

    expect(result.plugins).toHaveLength(1);
    const pluginBeginAt = result.plugins[0].beginAt;
    expect(pluginBeginAt).toBeInstanceOf(Date);
    if (!pluginBeginAt) {
      throw new Error('Expected plugin beginAt to be defined');
    }

    const module = result.plugins[0].modules[0];
    const moduleBeginAt = module.beginAt;
    expect(moduleBeginAt).toBeInstanceOf(Date);
    if (!moduleBeginAt) {
      throw new Error('Expected module beginAt to be defined');
    }
    expect(module.resultAt.getTime()).toBeGreaterThanOrEqual(
      moduleBeginAt.getTime(),
    );
  });

  it('should include init begin timestamps on failed results', () => {
    const collector = createInitializationResultCollector({
      pluginIds: ['plugin1'],
      allowBootFailurePredicate: () => true,
    });

    const error = new Error('boom');
    collector.onPluginInitBegin('plugin1');
    collector.onPluginResult('plugin1', error);

    const result = collector.finalize();

    expect(result.plugins[0].failure?.error).toBe(error);
    expect(result.plugins[0].beginAt).toBeInstanceOf(Date);
  });

  it('should omit init begin timestamps when initialization was never reached', () => {
    const collector = createInitializationResultCollector({
      pluginIds: ['plugin1'],
      allowBootFailurePredicate: () => true,
    });

    collector.onPluginResult('plugin1', new Error('registration failed'));

    const result = collector.finalize();

    expect(result.plugins[0].beginAt).toBeUndefined();
    expect(result.plugins[0].failure?.allowed).toBe(true);
  });
});

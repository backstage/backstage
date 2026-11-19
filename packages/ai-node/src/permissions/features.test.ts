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

import { ConfigReader, type JsonObject } from '@backstage/config';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type {
  AuditorService,
  BackstageCredentials,
  DatabaseService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import {
  allowDecision,
  createAuthServiceDouble,
  createLifecycleServiceDouble,
  createPermissionsServiceDouble,
} from '@backstage/ai-node-test-utils/alpha';
import type {
  PermissionCondition,
  PermissionCriteria,
  QueryPermissionResponse,
} from '@backstage/plugin-permission-common';
import type { Context } from '@earendil-works/chord/context';
import type { Harness, RegistryReader } from '@earendil-works/pi-durable';
import {
  DefaultAiService,
  type AcquisitionBinding,
  type AiServiceIntegration,
  type DefaultAiServiceDeps,
  type NativeHarnessHandle,
  type OpenNativeHarnessInput,
} from '../DefaultAiService';
import type { AiFeatureName, ConfigAtPath } from '../contracts';
import { aiFeatureConditions } from './rules';

/**
 * NONPRODUCTION TEST STAND-IN for the service integration: enough of the
 * lifecycle to exercise feature admission, with no lease, storage or guard.
 */
class StandInIntegration implements AiServiceIntegration {
  registeredFeatures: readonly AiFeatureName[] = ['tools', 'codemode'];
  /** Attach a tools facade to opened harnesses, as the real integration does. */
  provideTools = true;
  readonly bindings: AcquisitionBinding[] = [];
  lastOpenInput: OpenNativeHarnessInput | undefined;
  opens = 0;

  async ensureSessionOwnership(): Promise<{ owner: string }> {
    return { owner: 'user:user:default/alice' };
  }

  async bindAcquisition(binding: AcquisitionBinding): Promise<void> {
    this.bindings.push(binding);
  }

  async openNativeHarness(
    input: OpenNativeHarnessInput,
  ): Promise<NativeHarnessHandle> {
    this.lastOpenInput = input;
    this.opens += 1;
    return {
      harness: {} as Harness,
      context: {} as Context,
      ...(this.provideTools
        ? {
            tools: {
              callTool: async () => 'tool-output',
            } as unknown as NativeHarnessHandle['tools'],
          }
        : {}),
    } as NativeHarnessHandle;
  }

  async releaseNativeHarness(): Promise<void> {}
}

function makeDeps(
  decide: (conditions?: unknown) => unknown,
  calls: Array<{ permission: string; credentials: BackstageCredentials }>,
): DefaultAiServiceDeps {
  return {
    database: {} as DatabaseService,
    auth: createAuthServiceDouble(),
    permissions: createPermissionsServiceDouble({
      authorize: request => {
        calls.push({
          permission: request.permission.name,
          credentials: undefined as unknown as BackstageCredentials,
        });
        return allowDecision;
      },
      query: (request, credentials) => {
        calls.push({
          permission: request.permission.name,
          credentials: credentials as BackstageCredentials,
        });
        return decide() as QueryPermissionResponse;
      },
    }),
    logger: mockServices.logger.mock(),
    auditor: {} as AuditorService,
    lifecycle: createLifecycleServiceDouble(),
    pluginMetadata: { getId: () => 'scaffolder' } as PluginMetadataService,
    events: mockServices.events(),
  };
}

const USER_A = mockCredentials.user('user:default/alice');

function config(path = 'assistant'): ConfigAtPath {
  return {
    root: new ConfigReader({
      [path]: {
        mode: 'service',
        model: { provider: 'acme', modelId: 'acme-large' },
      } as JsonObject,
    }),
    path,
  };
}

const OPEN = {
  sessionId: 'features',
  config: config(),
  credentials: USER_A,
  registry: {
    snapshot: () => ({} as ReturnType<RegistryReader['snapshot']>),
    subscribe: () => () => {},
  } as RegistryReader,
  registryVersion: 'v1',
};

function envelope(
  conditions?: PermissionCondition | PermissionCriteria<PermissionCondition>,
) {
  return {
    result: 'CONDITIONAL',
    pluginId: 'ai',
    resourceType: 'ai-feature',
    conditions,
  };
}

describe('harness features', () => {
  it('exposes a registered feature under the default allow and snapshots it', async () => {
    const calls: Array<{
      permission: string;
      credentials: BackstageCredentials;
    }> = [];
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(() => ({ result: 'ALLOW' }), calls),
      integration,
    });

    const handle = await service.openHarness({
      ...OPEN,
      features: ['tools'],
    });

    // The query is the fixed permission, made with the caller's credentials.
    expect(calls).toEqual([
      { permission: 'ai.feature.use', credentials: USER_A },
    ]);
    // The granted set reaches the integration, and is snapshotted on the
    // admission rather than consulted again per dispatch.
    expect(integration.lastOpenInput?.features).toEqual(['tools']);
    expect(integration.bindings[0].features).toEqual(['tools']);
    expect(handle.tools).toBeDefined();

    // Re-opening the live session with the same declaration joins it.
    const joined = await service.openHarness({ ...OPEN, features: ['tools'] });
    expect(integration.opens).toBe(1);
    expect(joined.tools).toBeDefined();

    await handle.release();
    await joined.release();
  });

  it('denies a feature the policy withholds, naming the feature and plugin', async () => {
    const calls: Array<{
      permission: string;
      credentials: BackstageCredentials;
    }> = [];
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(
        // Only the scaffolder plugin's code mode is granted.
        () =>
          envelope(aiFeatureConditions.isPlugin({ pluginId: 'soundcheck' })),
        calls,
      ),
      integration,
    });

    await expect(
      service.openHarness({ ...OPEN, features: ['tools', 'codemode'] }),
    ).rejects.toThrow(
      /feature 'tools' is not available to the 'scaffolder' plugin.*ai\.feature\.use/,
    );
    // Nothing was admitted: no harness, no binding.
    expect(integration.opens).toBe(0);
    expect(integration.bindings).toHaveLength(0);
    expect(calls).toHaveLength(1);

    // The same policy grants a plugin it names, per feature.
    const granted = DefaultAiService.create({
      deps: makeDeps(
        () =>
          envelope(aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' })),
        calls,
      ),
      integration: new StandInIntegration(),
    });
    const handle = await granted.openHarness({
      ...OPEN,
      features: ['codemode'],
    });
    expect(handle.tools).toBeUndefined();
    await handle.release();
  });

  it('fails closed when nothing registers the requested feature', async () => {
    const integration = new StandInIntegration();
    integration.registeredFeatures = ['tools'];
    const service = DefaultAiService.create({
      deps: makeDeps(() => ({ result: 'ALLOW' }), []),
      integration,
    });

    await expect(
      service.openHarness({ ...OPEN, features: ['codemode'] }),
    ).rejects.toThrow(
      /feature 'codemode', which this service does not provide.*Registered features: \[tools\].*wiring, not policy/s,
    );
    expect(integration.opens).toBe(0);
  });

  it('rejects a changed feature declaration under a live handle', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(() => ({ result: 'ALLOW' }), []),
      integration,
    });
    const handle = await service.openHarness({ ...OPEN, features: ['tools'] });

    await expect(
      service.openHarness({ ...OPEN, features: ['codemode'] }),
    ).rejects.toThrow(/open with features \[tools\].*requesting \[codemode\]/);

    // A harness that requests nothing has no feature surface at all, and the
    // snapshot survives until the last handle releases.
    await handle.release();
    const bare = await service.openHarness(OPEN);
    expect(bare.tools).toBeUndefined();
    expect(integration.lastOpenInput?.features).toEqual([]);
    await bare.release();
  });

  it('rejects a malformed feature declaration instead of guessing', async () => {
    const service = DefaultAiService.create({
      deps: makeDeps(() => ({ result: 'ALLOW' }), []),
      integration: new StandInIntegration(),
    });

    await expect(
      service.openHarness({
        ...OPEN,
        features: ['shell'] as unknown as AiFeatureName[],
      }),
    ).rejects.toThrow(/features' must be a list of the harness features/);
  });
});

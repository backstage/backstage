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

import { type JsonObject, ConfigReader } from '@backstage/config';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type {
  AuditorService,
  AuthService,
  BackstageCredentials,
  DatabaseService,
  LifecycleService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { BACKGROUND_CONTEXT } from '@earendil-works/chord/context';
import {
  configure,
  type AgentState,
  type ConversationId,
  type ConversationRecord,
  type Harness,
  type RegistryReader,
  type Tx,
} from '@earendil-works/pi-durable';
import {
  DefaultAiService,
  type AcquisitionBinding,
  type AiServiceIntegration,
  type DefaultAiServiceDeps,
  type NativeHarnessHandle,
  type OpenNativeHarnessInput,
} from './DefaultAiService';
import type { ConfigAtPath } from './contracts';

/** NONPRODUCTION TEST STAND-IN for a native conversation handle. */
class StandInConversation {
  constructor(readonly id: number, private readonly harness: StandInHarness) {}

  async configure(
    change: Parameters<typeof configure>[2],
    _context?: unknown,
  ): Promise<void> {
    await configure(this.harness.tx(), this.id as ConversationId, change);
  }
}

/**
 * NONPRODUCTION TEST STAND-IN for a native Pi harness.
 *
 * It emulates the native creation ordering that the managed service relies
 * on: `conversationCreated` runs in the creating commit, before an explicit
 * `agent` from the caller's creation options is applied, and an already
 * existing (persisted) conversation is returned without reconfiguration.
 */
class StandInHarness {
  closed = false;
  rootExists = false;
  rootCalls = 0;
  readonly agents = new Map<string, AgentState>();
  readonly conversationCreatedCalls: ConversationRecord[] = [];
  readonly #conversationCreated: OpenNativeHarnessInput['conversationCreated'];

  constructor(
    conversationCreated: OpenNativeHarnessInput['conversationCreated'],
  ) {
    this.#conversationCreated = conversationCreated;
  }

  agentOf(conversationId: number): Readonly<AgentState> | undefined {
    return this.agents.get(String(conversationId));
  }

  async close(): Promise<void> {
    this.closed = true;
  }

  async root(
    _context: unknown,
    options?: { agent?: Parameters<typeof configure>[2] },
  ): Promise<StandInConversation> {
    this.rootCalls += 1;
    const rootId = 1 as ConversationId;
    if (this.rootExists) {
      // Persisted conversations are never reconfigured on open.
      return new StandInConversation(rootId, this);
    }
    this.rootExists = true;
    await this.create(rootId, {}, options);
    return new StandInConversation(rootId, this);
  }

  async createConversation(
    options: { agent?: Parameters<typeof configure>[2] },
    _context: unknown,
  ): Promise<StandInConversation> {
    const id = (this.agents.size + 2) as ConversationId;
    await this.create(id, {}, options);
    return new StandInConversation(id, this);
  }

  private async create(
    id: ConversationId,
    record: Partial<ConversationRecord>,
    options: { agent?: Parameters<typeof configure>[2] } = {},
  ): Promise<void> {
    const conversation: ConversationRecord = {
      id,
      ...record,
    } as ConversationRecord;
    this.conversationCreatedCalls.push(conversation);
    const tx = this.tx();
    await this.#conversationCreated?.(tx, conversation);
    // Native conveniences apply an explicit agent after the creation hook,
    // so explicit initialization wins per field.
    if (options.agent !== undefined) {
      await configure(tx, id, options.agent);
    }
  }

  tx(): Tx {
    const agents = this.agents;
    return {
      async doc(_token: unknown, conversationId: ConversationId) {
        const key = String(conversationId);
        let state = agents.get(key);
        if (state === undefined) {
          state = {};
          agents.set(key, state);
        }
        return state;
      },
    } as unknown as Tx;
  }
}

/**
 * NONPRODUCTION TEST STAND-IN for the Wave 1 integration.
 *
 * It emulates session ownership and harness open/release in memory so the
 * scaffold's management behavior can be exercised. It provides no lease, no
 * storage, and no guard, and must never be used as or presented as
 * production security or durability.
 */
class StandInIntegration implements AiServiceIntegration {
  readonly sessions = new Map<string, string>();
  readonly handles: StandInHarness[] = [];
  readonly released: StandInHarness[] = [];
  readonly bindings: AcquisitionBinding[] = [];
  lastOpenInput: OpenNativeHarnessInput | undefined;

  #sessionKey(namespace: { pluginId: string; sessionId: string }): string {
    return JSON.stringify([namespace.pluginId, namespace.sessionId]);
  }

  async ensureSessionOwnership(input: {
    namespace: { pluginId: string; sessionId: string };
    owner: string;
  }): Promise<{ owner: string }> {
    const key = this.#sessionKey(input.namespace);
    const existing = this.sessions.get(key);
    if (existing === undefined) {
      // Atomic create-with-owner: once set, ownership is fixed.
      this.sessions.set(key, input.owner);
      return { owner: input.owner };
    }
    return { owner: existing };
  }

  async bindAcquisition(binding: AcquisitionBinding): Promise<void> {
    this.bindings.push(binding);
  }

  async openNativeHarness(
    input: OpenNativeHarnessInput,
  ): Promise<NativeHarnessHandle> {
    this.lastOpenInput = input;
    const harness = new StandInHarness(input.conversationCreated);
    this.handles.push(harness);
    return {
      harness: harness as unknown as Harness,
      context: BACKGROUND_CONTEXT,
    };
  }

  async releaseNativeHarness(handle: NativeHarnessHandle): Promise<void> {
    const standIn = handle.harness as unknown as StandInHarness;
    standIn.closed = true;
    this.released.push(standIn);
  }
}

function makeDeps(captured?: {
  shutdownHook?: () => Promise<void>;
}): DefaultAiServiceDeps {
  return {
    database: {} as DatabaseService,
    auth: {
      isPrincipal: (
        credentials: BackstageCredentials,
        type: 'user' | 'service',
      ) => (credentials.principal as { type: string }).type === type,
    } as unknown as AuthService,
    permissions: {} as PermissionsService,
    logger: mockServices.logger.mock(),
    auditor: {} as AuditorService,
    lifecycle: {
      addShutdownHook: (hook: () => Promise<void>) => {
        if (captured) {
          captured.shutdownHook = hook;
        }
      },
    } as unknown as LifecycleService,
    pluginMetadata: { getId: () => 'test-plugin' } as PluginMetadataService,
  };
}

function makeRegistry(): RegistryReader {
  return {
    snapshot: () => ({} as ReturnType<RegistryReader['snapshot']>),
    subscribe: () => () => {},
  };
}

function serviceConfig(data: JsonObject, path = 'assistant'): ConfigAtPath {
  return { root: new ConfigReader({ [path]: data }), path };
}

const USER_A = mockCredentials.user('user:default/alice');
const USER_B = mockCredentials.user('user:default/bob');

const SERVICE_MODE_CONFIG = serviceConfig({
  mode: 'service',
  model: { provider: 'acme', modelId: 'acme-large' },
  thinkingLevel: 'high',
});

describe('DefaultAiService', () => {
  it('fails closed when the Wave 1 integration is missing', async () => {
    const service = DefaultAiService.create({ deps: makeDeps() });
    await expect(
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
    ).rejects.toThrow(/fail closed.*storage.*lease.*guard|Wave 1/s);
  });

  it('rejects invalid session ids, registry versions, and credentials', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const options = {
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    };

    await expect(
      service.openHarness({ ...options, sessionId: '' }),
    ).rejects.toThrow(/sessionId.*nonempty/s);
    await expect(
      service.openHarness({ ...options, sessionId: 'x'.repeat(257) }),
    ).rejects.toThrow(/sessionId/s);
    await expect(
      service.openHarness({ ...options, registryVersion: '' }),
    ).rejects.toThrow(/registryVersion.*nonempty/s);
    await expect(
      service.openHarness({
        ...options,
        credentials: mockCredentials.none(),
      }),
    ).rejects.toThrow(/authenticated/s);
  });

  it('acquires a namespace single-flight and reference counts releases', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });

    const first = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    const second = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    // One process-local shared harness for the namespace.
    expect(integration.handles).toHaveLength(1);
    await first.harness.root(first.context);
    await second.harness.root(second.context);
    expect(integration.handles[0].rootCalls).toBe(2);
    expect(integration.handles[0].conversationCreatedCalls).toHaveLength(1);

    // Releasing one reference keeps the harness alive.
    await first.release();
    expect(integration.released).toHaveLength(0);
    await second.harness.root(second.context);

    // The last release closes the shared harness exactly once.
    await second.release();
    expect(integration.released).toHaveLength(1);

    // Release is idempotent per acquisition.
    await second.release();
    expect(integration.released).toHaveLength(1);
  });

  it('single-flights concurrent opens of the same namespace', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });

    const [first, second] = await Promise.all([
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
    ]);
    expect(integration.handles).toHaveLength(1);
    expect(first.context).toBe(second.context);

    await first.release();
    await second.release();
  });

  it('rejects methods and close on a released handle', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    await handle.release();

    await expect(handle.harness.root(handle.context)).rejects.toThrow(
      /released/s,
    );
    await expect(
      (handle.harness as unknown as { close(): Promise<void> }).close(),
    ).rejects.toThrow(/release\(\)/s);
  });

  it('rejects changed registry version and config under a live handle', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    await expect(
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v2',
      }),
    ).rejects.toThrow(/registry version.*'v1'.*'v2'/s);

    await expect(
      service.openHarness({
        sessionId: 's1',
        config: serviceConfig({
          mode: 'service',
          model: { provider: 'acme', modelId: 'acme-small' },
          thinkingLevel: 'high',
        }),
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
    ).rejects.toThrow(/different configuration/s);
  });

  it('checks session ownership and rejects other principals', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    await expect(
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_B,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
    ).rejects.toThrow(
      /owned by 'user:user:default\/alice'.*'user:user:default\/bob'/s,
    );
  });

  it('initializes only new conversations from configuration', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    const root = await handle.harness.root(handle.context);
    const agent = integration.handles[0].agentOf(root.id);
    expect(agent).toEqual({
      model: { provider: 'acme', modelId: 'acme-large' },
      thinkingLevel: 'high',
    });

    const conversation = await handle.harness.createConversation(
      { ownership: { kind: 'ownerless' } },
      handle.context,
    );
    expect(integration.handles[0].agentOf(conversation.id)).toEqual({
      model: { provider: 'acme', modelId: 'acme-large' },
      thinkingLevel: 'high',
    });

    await handle.release();
  });

  it('lets explicit native initialization win over configuration', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    const root = await handle.harness.root(handle.context, {
      agent: { model: { provider: 'other', modelId: 'other-model' } },
    });
    expect(integration.handles[0].agentOf(root.id)).toEqual({
      model: { provider: 'other', modelId: 'other-model' },
      thinkingLevel: 'high',
    });

    await handle.release();
  });

  it('does not reconfigure a persisted root on reopen', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    await handle.release();

    // A reopened namespace restores persisted state: the root exists and its
    // agent was configured in a previous session.
    const reopened = new StandInHarness(undefined);
    reopened.rootExists = true;
    reopened.agents.set('1', {
      model: { provider: 'persisted', modelId: 'persisted-model' },
    });
    integration.openNativeHarness = async input => {
      integration.lastOpenInput = input;
      integration.handles.push(reopened);
      return {
        harness: reopened as unknown as Harness,
        context: BACKGROUND_CONTEXT,
      };
    };

    const second = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    const root = await second.harness.root(second.context);
    expect(reopened.conversationCreatedCalls).toHaveLength(0);
    expect(reopened.agentOf(root.id)).toEqual({
      model: { provider: 'persisted', modelId: 'persisted-model' },
    });

    await second.release();
  });

  it('never exposes the raw harness through the mediated view', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    const raw = integration.handles[0];
    const view = handle.harness as unknown as Record<string, unknown>;

    // Reflection must not recover the raw harness, whose close() would
    // bypass the managed lifecycle.
    expect(view.valueOf()).not.toBe(raw);
    expect(view.valueOf()).not.toBe(raw as unknown as object);
    expect(view.constructor).not.toBe(raw.constructor);

    // A method captured before release still rejects at invocation time.
    const capturedRoot = view.root as (
      context: unknown,
    ) => Promise<StandInConversation>;
    await handle.release();
    await expect(capturedRoot(handle.context)).rejects.toThrow(/released/s);
  });

  it('mediates operation-bearing results and gates them on release', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    const conversation = await handle.harness.root(handle.context);
    await conversation.configure(
      { instructions: 'inspect the catalog' },
      handle.context,
    );
    expect(integration.handles[0].agentOf(conversation.id)).toEqual({
      model: { provider: 'acme', modelId: 'acme-large' },
      thinkingLevel: 'high',
      instructions: 'inspect the catalog',
    });

    // The returned conversation is a mediated view of the same acquisition:
    // after release its operations reject too.
    await handle.release();
    await expect(
      conversation.configure({ instructions: 'more' }, handle.context),
    ).rejects.toThrow(/released/s);
  });

  it('keeps other acquisitions live when one handle is released', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const options = {
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    };
    const first = await service.openHarness(options);
    const second = await service.openHarness(options);

    await first.release();
    await expect(first.harness.root(first.context)).rejects.toThrow(
      /released/s,
    );

    const conversation = await second.harness.root(second.context);
    await conversation.configure(
      { instructions: 'still live' },
      second.context,
    );
    expect(integration.released).toHaveLength(0);

    await second.release();
    expect(integration.released).toHaveLength(1);
  });

  it('binds per-acquisition authority with the original credentials on every path', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const options = {
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      registry: makeRegistry(),
      registryVersion: 'v1',
    };

    // Same service subject, distinct credentials with different restrictions:
    // both reach the integration seam as the original objects.
    const credentialsA = mockCredentials.service('external:shared-service');
    const credentialsB = mockCredentials.service('external:shared-service');
    const first = await service.openHarness({
      ...options,
      credentials: credentialsA,
    });
    const second = await service.openHarness({
      ...options,
      credentials: credentialsB,
    });

    expect(integration.bindings).toHaveLength(2);
    expect(integration.bindings[0].credentials).toBe(credentialsA);
    expect(integration.bindings[1].credentials).toBe(credentialsB);
    expect(integration.bindings[1].owner).toBe(integration.bindings[0].owner);
    expect(integration.lastOpenInput?.credentials).toBe(credentialsA);

    await first.release();
    await second.release();
  });

  it('blocks the acquisition when authority binding rejects', async () => {
    const integration = new StandInIntegration();
    integration.bindAcquisition = async () => {
      throw new Error('denied by policy');
    };
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    await expect(
      service.openHarness({
        sessionId: 's1',
        config: SERVICE_MODE_CONFIG,
        credentials: USER_A,
        registry: makeRegistry(),
        registryVersion: 'v1',
      }),
    ).rejects.toThrow('denied by policy');
    expect(integration.handles).toHaveLength(0);
  });

  it('rejects opens that lose a race with shutdown and cleans up', async () => {
    const integration = new StandInIntegration();
    const captured: { shutdownHook?: () => Promise<void> } = {};
    const service = DefaultAiService.create({
      deps: makeDeps(captured),
      integration,
    });
    const options = {
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    };

    let resolveOpen: ((handle: NativeHarnessHandle) => void) | undefined;
    integration.openNativeHarness = async input => {
      integration.lastOpenInput = input;
      return new Promise(resolve => {
        resolveOpen = resolve;
      });
    };

    const inFlight = service.openHarness(options);
    const queued = service.openHarness(options);
    // Attach handlers to both before unblocking, so neither rejection is
    // ever unhandled.
    const rejections = [inFlight, queued].map(pending =>
      pending.then(
        () => {
          throw new Error('expected the open to reject');
        },
        error => error,
      ),
    );

    // Let the in-flight acquisition progress until it blocks inside
    // openNativeHarness, so the shutdown races a real pending open.
    await new Promise<void>(resolve => {
      const poll = () => {
        if (resolveOpen !== undefined) {
          resolve();
        } else {
          setImmediate(poll);
        }
      };
      poll();
    });

    await captured.shutdownHook!();

    resolveOpen!({
      harness: new StandInHarness(undefined) as unknown as Harness,
      context: BACKGROUND_CONTEXT,
    });

    const [inFlightError, queuedError] = await Promise.all(rejections);
    expect((inFlightError as Error).message).toMatch(/shut down/s);
    expect((queuedError as Error).message).toMatch(/shut down/s);
    // The harness opened by the losing race is cleaned up, not published.
    expect(integration.released).toHaveLength(1);
    await expect(service.openHarness(options)).rejects.toThrow(/shut down/s);
  });

  it('supports the documented destructured release usage', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });

    const { harness, context, release } = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    try {
      const conversation = await harness.root(context);
      expect(conversation.id).toBe(1);
    } finally {
      await release();
    }

    // Still idempotent when destructured.
    await release();
    expect(integration.released).toHaveLength(1);
  });

  it('keeps fork copies and task-owned conversations untouched', async () => {
    const integration = new StandInIntegration();
    const service = DefaultAiService.create({
      deps: makeDeps(),
      integration,
    });
    const handle = await service.openHarness({
      sessionId: 's1',
      config: SERVICE_MODE_CONFIG,
      credentials: USER_A,
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    await handle.release();

    // The conversationCreated hook is passed through to the native harness
    // options; it covers raw tx.createConversation too. Drive it directly
    // with fork and task-owned records, as Pi would.
    const hook = integration.lastOpenInput?.conversationCreated;
    expect(hook).toBeDefined();
    const harness = integration.handles[0];
    const tx = harness.tx();

    await hook!(tx, {
      id: 2 as ConversationId,
      parent: { conversationId: 1 as ConversationId, at: 5 as never },
    } as ConversationRecord);
    expect(harness.agentOf(2)).toBeUndefined();

    await hook!(tx, {
      id: 3 as ConversationId,
      owner: { conversationId: 1 as ConversationId, taskId: 1 as never },
    } as ConversationRecord);
    expect(harness.agentOf(3)).toBeUndefined();

    await hook!(tx, { id: 4 as ConversationId } as ConversationRecord);
    expect(harness.agentOf(4)).toEqual({
      model: { provider: 'acme', modelId: 'acme-large' },
      thinkingLevel: 'high',
    });
  });
});

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

import type { Context } from '@earendil-works/chord/context';
import {
  configure,
  type AgentChange,
  type ConversationRecord,
  type Harness,
  type RegistryReader,
  type Tx,
} from '@earendil-works/pi-durable';
import type {
  AuditorService,
  AuthService,
  BackstageCredentials,
  DatabaseService,
  LifecycleService,
  LoggerService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { parseAiServiceConfig, type AiServiceConfig } from './config';
import type {
  AiService,
  ConfigAtPath,
  ManagedHarness,
  ManagedNativeHarness,
  Namespace,
  OpenHarnessOptions,
} from './contracts';

/**
 * A process-local native harness opened by the Wave 1 integration.
 *
 * @internal
 */
export interface NativeHarnessHandle {
  readonly harness: Harness;
  readonly context: Context;
}

/** Input to {@link AiServiceIntegration.openNativeHarness}. */
export interface OpenNativeHarnessInput {
  readonly namespace: Namespace;
  readonly owner: string;
  readonly registry: RegistryReader;
  readonly registryVersion: string;
  /**
   * Installed by the service so that configuration initializes new
   * conversations only; see the package README. The integration must pass it
   * through to the native harness options.
   */
  readonly conversationCreated?: (
    tx: Tx,
    conversation: ConversationRecord,
  ) => void | Promise<void>;
}

/**
 * Wave 1 integration seam of the managed AI service.
 *
 * @remarks
 *
 * This reserves the private integration contract for the Wave 1 wiring: the
 * exclusive namespace lease (design §2), the Knex Pi storage adapter (design
 * §3), and the guarded model operation boundary (design §6). Wave 0 ships no
 * production implementation: the default service factory creates the service
 * without an integration, and every production `openHarness` call fails
 * closed with an actionable error rather than expose an unguarded harness.
 *
 * Wave 0 scaffold tests may inject an explicitly labeled non-production
 * stand-in; a stand-in must never be presented as production
 * security or durability.
 *
 * @internal
 */
export interface AiServiceIntegration {
  /**
   * Atomically returns the owner of the session's namespace, creating the
   * session record with `owner` when it does not exist yet.
   */
  ensureSessionOwnership(input: {
    readonly namespace: Namespace;
    readonly owner: string;
  }): Promise<{ readonly owner: string }>;

  /**
   * Acquires the namespace lease and opens the process-local native harness
   * for it, applying `conversationCreated` to the native harness options.
   */
  openNativeHarness(
    input: OpenNativeHarnessInput,
  ): Promise<NativeHarnessHandle>;

  /**
   * Called when the last reference to a namespace is released. Must seal
   * admission, settle accepted commits, close the harness and storage, and
   * release the lease without cancelling admitted durable work.
   */
  releaseNativeHarness(handle: NativeHarnessHandle): Promise<void>;
}

/** Dependencies injected by the plugin-scoped service factory. */
export interface DefaultAiServiceDeps {
  readonly database: DatabaseService;
  readonly auth: AuthService;
  readonly permissions: PermissionsService;
  readonly logger: LoggerService;
  readonly auditor: AuditorService;
  readonly lifecycle: LifecycleService;
  readonly pluginMetadata: PluginMetadataService;
}

/** Options for {@link DefaultAiService.create}. */
export interface DefaultAiServiceOptions {
  readonly deps: DefaultAiServiceDeps;
  /**
   * Wave 1 integration. Absent in Wave 0, which makes every production
   * `openHarness` call fail closed.
   */
  readonly integration?: AiServiceIntegration;
}

/** Upper bound for caller-supplied stable identifiers. */
const IDENTIFIER_MAX_LENGTH = 256;

type LiveNamespace = {
  readonly namespace: Namespace;
  readonly handle: NativeHarnessHandle;
  readonly registryVersion: string;
  readonly configKey: string;
  readonly references: Set<ManagedHarnessHandle>;
};

function namespaceKey(namespace: Namespace): string {
  return JSON.stringify([namespace.pluginId, namespace.sessionId]);
}

function configKeyOf(config: ConfigAtPath, parsed: AiServiceConfig): string {
  return JSON.stringify([config.path, parsed]);
}

/**
 * Builds the native agent change that initializes new conversations from the
 * parsed configuration. No default model is ever injected: a conversation
 * without a chosen model rejects generation.
 */
function newConversationAgent(config: AiServiceConfig): AgentChange {
  return {
    ...(config.model === undefined
      ? {}
      : {
          model: {
            provider: config.model.provider,
            modelId: config.model.modelId,
          },
        }),
    ...(config.thinkingLevel === undefined
      ? {}
      : { thinkingLevel: config.thinkingLevel }),
  };
}

/**
 * Creates the native `conversationCreated` hook that applies configuration to
 * new conversations only.
 *
 * @remarks
 *
 * The hook runs in every commit that creates or forks a conversation,
 * including raw `tx.createConversation()`, before the native conveniences
 * apply an explicit `agent`, so explicit native initialization wins. Forks
 * keep the agent state copied from their fork entry, and task-owned
 * conversations keep the agent copied from their owner, so neither is reset.
 */
function conversationCreatedHook(
  config: AiServiceConfig,
): OpenNativeHarnessInput['conversationCreated'] {
  const change = newConversationAgent(config);
  if (change.model === undefined && change.thinkingLevel === undefined) {
    return undefined;
  }
  return async (tx, conversation) => {
    if (conversation.parent !== undefined || conversation.owner !== undefined) {
      return;
    }
    await configure(tx, conversation.id, change);
  };
}

/**
 * Wraps a native harness in the mediated view exposed on managed handles.
 *
 * @remarks
 *
 * This is a real per-handle facade, not the raw harness cast to
 * `Omit<Harness, 'close'>`: `close` is replaced with a rejection, every
 * access is checked against the handle's release state, and methods on a
 * released handle reject.
 */
function createManagedNativeHarness(
  target: Harness,
  isReleased: () => boolean,
): ManagedNativeHarness {
  const closeRejected = () =>
    Promise.reject(
      new Error(
        "close() is not part of the managed harness view; use release() on the managed handle instead. Closing is owned by the managed service's lifecycle",
      ),
    );
  const releasedRejected = () =>
    Promise.reject(
      new Error(
        'This managed harness handle has been released and can no longer be used. Open the harness again to continue working with the session; releasing never cancels admitted durable work',
      ),
    );
  const releasedThrown = new Error(
    'This managed harness handle has been released and can no longer be used. Open the harness again to continue working with the session',
  );

  return new Proxy(target, {
    get(native, property) {
      if (property === 'close') {
        return closeRejected;
      }
      const value = Reflect.get(native, property, native);
      if (typeof value !== 'function') {
        if (isReleased()) {
          throw releasedThrown;
        }
        return value;
      }
      if (isReleased()) {
        return releasedRejected;
      }
      return value.bind(native);
    },
  }) as ManagedNativeHarness;
}

/** A reference-counted acquisition of a process-local shared harness. */
class ManagedHarnessHandle implements ManagedHarness {
  readonly harness: ManagedNativeHarness;
  readonly context: Context;
  readonly #service: DefaultAiService;
  readonly #live: LiveNamespace;
  #released = false;

  constructor(service: DefaultAiService, live: LiveNamespace) {
    this.#service = service;
    this.#live = live;
    this.context = live.handle.context;
    this.harness = createManagedNativeHarness(
      live.handle.harness,
      () => this.#released,
    );
  }

  async release(): Promise<void> {
    if (this.#released) {
      return;
    }
    this.#released = true;
    await this.#service.releaseReference(this.#live, this);
  }
}

/**
 * The default {@link AiService} implementation.
 *
 * @remarks
 *
 * Wave 0 scaffold: it owns session ownership checks, single-flight namespace
 * acquisition, reference counting, release semantics, the mediated harness
 * view, configuration initialization of new conversations, and registry
 * version identity. The storage, lease, and guard integration is Wave 1 and
 * fails closed here.
 *
 * @internal
 */
export class DefaultAiService implements AiService {
  readonly #deps: DefaultAiServiceDeps;
  readonly #integration: AiServiceIntegration | undefined;
  readonly #live = new Map<string, LiveNamespace>();
  readonly #locks = new Map<string, Promise<unknown>>();
  #closed = false;

  static create(options: DefaultAiServiceOptions): AiService {
    return new DefaultAiService(options);
  }

  private constructor(options: DefaultAiServiceOptions) {
    this.#deps = options.deps;
    this.#integration = options.integration;
    options.deps.lifecycle.addShutdownHook(() => {
      this.#closed = true;
    });
  }

  async openHarness(options: OpenHarnessOptions): Promise<ManagedHarness> {
    const pluginId = this.#deps.pluginMetadata.getId();

    if (this.#closed) {
      throw new Error(
        `The AI service of the '${pluginId}' plugin is shut down and no longer accepts opens`,
      );
    }

    if (this.#integration === undefined) {
      throw new Error(
        `The '${pluginId}' plugin cannot open an AI harness: the managed AI service's Wave 1 integration is not wired yet, so opens fail closed rather than expose an unguarded harness. Missing integration: the Knex Pi storage adapter, the exclusive namespace lease, and the guarded model operation boundary. This is expected on the Wave 0 scaffold; there is no production stand-in`,
      );
    }

    if (
      typeof options.sessionId !== 'string' ||
      options.sessionId.length === 0 ||
      options.sessionId.length > IDENTIFIER_MAX_LENGTH
    ) {
      throw new Error(
        `Invalid openHarness call in the '${pluginId}' plugin: 'sessionId' must be a nonempty string of at most ${IDENTIFIER_MAX_LENGTH} characters, so that sessions have a stable, bounded identity`,
      );
    }
    if (
      typeof options.registryVersion !== 'string' ||
      options.registryVersion.length === 0 ||
      options.registryVersion.length > IDENTIFIER_MAX_LENGTH
    ) {
      throw new Error(
        `Invalid openHarness call in the '${pluginId}' plugin: 'registryVersion' must be a nonempty string of at most ${IDENTIFIER_MAX_LENGTH} characters, identifying the stable definition set of the supplied registry`,
      );
    }
    if (
      options.registry === undefined ||
      typeof options.registry.snapshot !== 'function'
    ) {
      throw new Error(
        `Invalid openHarness call in the '${pluginId}' plugin: 'registry' must be a Pi registry reader with required built-ins installed (see createRegistry)`,
      );
    }
    if (
      options.config === undefined ||
      options.config.root === undefined ||
      typeof options.config.path !== 'string' ||
      options.config.path.length === 0
    ) {
      throw new Error(
        `Invalid openHarness call in the '${pluginId}' plugin: 'config' must supply the root config and the plugin's own configuration path; there is no implicit AI configuration path`,
      );
    }

    const parsedConfig = parseAiServiceConfig(options.config, pluginId);
    const owner = this.ownerKeyOf(options.credentials);
    const namespace: Namespace = {
      pluginId,
      sessionId: options.sessionId,
    };
    const key = namespaceKey(namespace);
    const configKey = configKeyOf(options.config, parsedConfig);

    return this.exclusive(key, async () => {
      const ownership = await this.#integration!.ensureSessionOwnership({
        namespace,
        owner,
      });
      if (ownership.owner !== owner) {
        throw new Error(
          `Access denied: the AI session '${options.sessionId}' of the '${pluginId}' plugin is owned by '${ownership.owner}' and cannot be opened by '${owner}'. Session ownership is fixed when the session is created`,
        );
      }

      const live = this.#live.get(key);
      if (live !== undefined) {
        if (live.registryVersion !== options.registryVersion) {
          throw new Error(
            `The AI session '${options.sessionId}' of the '${pluginId}' plugin is open with registry version '${live.registryVersion}' and cannot be reopened with '${options.registryVersion}'. A changed registry under a live handle is rejected rather than silently replacing running definitions; release the existing handles first or keep one stable registry version`,
          );
        }
        if (live.configKey !== configKey) {
          throw new Error(
            `The AI session '${options.sessionId}' of the '${pluginId}' plugin is open with a different configuration at '${options.config.path}'. Incompatible config identity under a live handle is rejected rather than silently replaced; release the existing handles first or keep the configuration stable`,
          );
        }
        const handle = new ManagedHarnessHandle(this, live);
        live.references.add(handle);
        return handle;
      }

      const nativeHandle = await this.#integration!.openNativeHarness({
        namespace,
        owner,
        registry: options.registry,
        registryVersion: options.registryVersion,
        conversationCreated: conversationCreatedHook(parsedConfig),
      });
      const newLive: LiveNamespace = {
        namespace,
        handle: nativeHandle,
        registryVersion: options.registryVersion,
        configKey,
        references: new Set<ManagedHarnessHandle>(),
      };
      const handle = new ManagedHarnessHandle(this, newLive);
      newLive.references.add(handle);
      this.#live.set(key, newLive);
      return handle;
    });
  }

  private ownerKeyOf(credentials: BackstageCredentials): string {
    if (this.#deps.auth.isPrincipal(credentials, 'user')) {
      return `user:${credentials.principal.userEntityRef}`;
    }
    if (this.#deps.auth.isPrincipal(credentials, 'service')) {
      return `service:${credentials.principal.subject}`;
    }
    throw new Error(
      `openHarness requires authenticated Backstage credentials carrying a user or service principal, but the supplied credentials are unauthenticated`,
    );
  }

  releaseReference(
    live: LiveNamespace,
    handle: ManagedHarnessHandle,
  ): Promise<void> {
    const key = namespaceKey(live.namespace);
    return this.exclusive(key, async () => {
      if (!live.references.delete(handle)) {
        return;
      }
      if (live.references.size > 0 || this.#live.get(key) !== live) {
        return;
      }
      this.#live.delete(key);
      await this.#integration?.releaseNativeHarness(live.handle);
    });
  }

  private async exclusive<T>(
    key: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    const previous = this.#locks.get(key) ?? Promise.resolve();
    const result = previous.then(operation, operation);
    const tail = result.then(
      () => undefined,
      () => undefined,
    );
    this.#locks.set(key, tail);
    void tail.then(() => {
      if (this.#locks.get(key) === tail) {
        this.#locks.delete(key);
      }
    });
    return result;
  }
}

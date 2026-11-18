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
import {
  parseAiServiceConfig,
  type AiServiceConfig,
  type AiServiceModel,
} from './config';
import type {
  AiService,
  ConfigAtPath,
  ManagedHarness,
  ManagedNativeHarness,
  Namespace,
  OpenHarnessOptions,
} from './contracts';
import type { GuardedToolOperations } from './tools/mediation';

/**
 * A process-local native harness opened by the Wave 1 integration.
 *
 * @internal
 */
export interface NativeHarnessHandle {
  readonly harness: Harness;
  readonly context: Context;
  /**
   * Guarded tool operations, present when tool modules are registered with
   * the integration. Tool calls dispatch through the same guarded path as
   * model operations.
   */
  readonly tools?: GuardedToolOperations;
}

/**
 * Per-acquisition authority for one `openHarness` call, supplied with the
 * original caller credentials.
 *
 * @remarks
 *
 * The original `BackstageCredentials` — not the derived owner string — are
 * the authority for an acquisition, so the Wave 1 integration can enforce
 * the original caller's restrictions and bind (renewed) user credentials.
 * Credentials are never persisted by the managed service; the owner string
 * is session bookkeeping, not authority.
 *
 * @internal
 */
export interface AcquisitionBinding {
  readonly namespace: Namespace;
  readonly owner: string;
  readonly credentials: BackstageCredentials;
  readonly registry: RegistryReader;
  readonly registryVersion: string;
  /** The configured model, when the plugin's configuration selected one. */
  readonly model?: AiServiceModel;
}

/** Input to {@link AiServiceIntegration.openNativeHarness}. */
export interface OpenNativeHarnessInput extends AcquisitionBinding {
  /** Stable identity of the configuration this acquisition was parsed from. */
  readonly configVersion: string;
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
   * session record with the acquisition's verified principal when it does not
   * exist yet, and rejecting a principal that does not match the recorded
   * session origin.
   */
  ensureSessionOwnership(
    binding: AcquisitionBinding,
  ): Promise<{ readonly owner: string }>;

  /**
   * Binds per-acquisition authority for every acquisition, including reuse
   * of an already live namespace: the Wave 1 integration authorizes with the
   * original caller credentials and their restrictions here. A rejection
   * blocks the acquisition. Must never persist the credentials.
   */
  bindAcquisition(binding: AcquisitionBinding): Promise<void>;

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

/** Dependencies injected by the plugin-scoped service factory. @alpha */
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
 * Release state shared by a managed handle's facade and every view it
 * returns; checked at operation invocation, not at property lookup.
 */
type MediationState = { released: boolean };

/**
 * The declared managed native surface: exactly the members of
 * `Omit<Harness, 'close'>` from the pinned Pi 1.5.2 declarations.
 *
 * @remarks
 *
 * The `Record` type checks both membership and completeness at compile time,
 * so an upstream surface change fails the build instead of silently widening
 * or narrowing the managed view. Everything else on the native harness — in
 * particular implementation-only runtime properties such as the underlying
 * `storage` — is not part of the managed surface and is hidden.
 */
const MANAGED_NATIVE_SURFACE: Readonly<
  Record<keyof ManagedNativeHarness, true>
> = {
  // Session and DocumentObserver surface
  commit: true,
  closed: true,
  observeDoc: true,
  observeCommits: true,
  subscribeClose: true,
  snapshot: true,
  snapshotAsOf: true,
  watchDoc: true,
  // Harness surface
  resume: true,
  wake: true,
  root: true,
  conversation: true,
  createConversation: true,
  inspect: true,
  getTask: true,
  submission: true,
  abortSubmission: true,
  abortTask: true,
  waitForIdle: true,
  waitForTask: true,
  usage: true,
  watchTaskGraph: true,
  observeConversation: true,
  observeTaskGraph: true,
};

/**
 * Receiver for members inherited from `Object.prototype`, so reflection on a
 * mediated view (for example `valueOf`) can never return the raw native
 * object.
 */
const SAFE_RECEIVER: object = Object.freeze({});

function findOwner(
  object: object,
  property: string | symbol,
): object | undefined {
  for (
    let current: object | null = object;
    current !== null;
    current = Object.getPrototypeOf(current)
  ) {
    if (Object.prototype.hasOwnProperty.call(current, property)) {
      return current;
    }
  }
  return undefined;
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

/**
 * Whether a returned value carries native operations and must be mediated:
 * a class instance, as opposed to plain data (primitives, plain objects,
 * arrays, dates).
 */
function isOperationBearing(value: unknown): value is object {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (Array.isArray(value) || value instanceof Date) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype !== Object.prototype && prototype !== null;
}

/**
 * Creates a mediated view of a native object for one managed handle.
 *
 * @remarks
 *
 * The raw native object is never the proxy target and is never returned:
 * members inherited from `Object.prototype` resolve against a safe receiver,
 * so reflection (`valueOf`, `constructor`) cannot recover it. Validity is
 * checked when an operation is invoked, not when its property is looked up,
 * so a method captured before release still rejects afterwards. Results that
 * carry native operations (conversations, submissions, watches) are mediated
 * with the same state.
 *
 * With `restrictToSurface`, only members of the declared managed native
 * surface are exposed; every other property of the native harness —
 * including implementation-only runtime capabilities such as the underlying
 * `storage` — is hidden.
 */
function createMediatedView<T extends object>(
  native: T,
  state: MediationState,
  options: { blockClose: boolean; restrictToSurface: boolean },
): T {
  return new Proxy({} as T, {
    get(_target, property) {
      if (options.blockClose && property === 'close') {
        return () =>
          Promise.reject(
            new Error(
              "close() is not part of the managed harness view; use release() on the managed handle instead. Closing is owned by the managed service's lifecycle",
            ),
          );
      }
      if (
        options.restrictToSurface &&
        (typeof property !== 'string' ||
          !Object.prototype.hasOwnProperty.call(
            MANAGED_NATIVE_SURFACE,
            property,
          ))
      ) {
        return undefined;
      }
      const owner = findOwner(native, property);
      if (owner === undefined) {
        return undefined;
      }
      const receiver = owner === Object.prototype ? SAFE_RECEIVER : native;
      const value = Reflect.get(receiver, property, receiver);
      if (typeof value !== 'function') {
        return value;
      }
      const raw = value.bind(receiver);
      return (...args: unknown[]) => {
        if (state.released) {
          return Promise.reject(
            new Error(
              'This managed harness handle has been released and can no longer be used. Open the harness again to continue working with the session; releasing never cancels admitted durable work',
            ),
          );
        }
        const result = raw(...args);
        if (isThenable(result)) {
          return result.then(mediated => mediateResult(mediated, state));
        }
        return mediateResult(result, state);
      };
    },
  }) as T;
}

function mediateResult<T>(value: T, state: MediationState): T {
  if (isOperationBearing(value)) {
    return createMediatedView(value, state, {
      blockClose: false,
      restrictToSurface: false,
    }) as T;
  }
  return value;
}

/**
 * Wraps a native harness in the mediated view exposed on managed handles.
 *
 * @remarks
 *
 * This is a real per-handle facade, not the raw harness cast to
 * `Omit<Harness, 'close'>`: `close` is replaced with a rejection, only the
 * members of the declared managed native surface are exposed, operation
 * validity is checked at invocation time, returned operation-bearing objects
 * are mediated, and the raw harness is unreachable through the view.
 */
function createManagedNativeHarness(
  native: Harness,
  state: MediationState,
): ManagedNativeHarness {
  return createMediatedView(native, state, {
    blockClose: true,
    restrictToSurface: true,
  });
}

/** A reference-counted acquisition of a process-local shared harness. */
class ManagedHarnessHandle implements ManagedHarness {
  readonly harness: ManagedNativeHarness;
  readonly context: Context;
  /** Guarded tool operations when tool modules are registered. */
  readonly tools?: GuardedToolOperations;
  /** Bound so the documented destructured `release()` usage works. */
  readonly release: () => Promise<void>;
  readonly #service: DefaultAiService;
  readonly #live: LiveNamespace;
  readonly #state: MediationState = { released: false };

  constructor(service: DefaultAiService, live: LiveNamespace) {
    this.#service = service;
    this.#live = live;
    this.context = live.handle.context;
    this.harness = createManagedNativeHarness(live.handle.harness, this.#state);
    if (live.handle.tools !== undefined) {
      // The shared tools facade is never handed out raw: each handle gets a
      // mediated view that fails closed after release, so a released handle
      // (or a method captured from it) can never dispatch a tool call — the
      // same boundary the mediated harness enforces for model operations.
      const nativeTools = live.handle.tools;
      const state = this.#state;
      this.tools = {
        callTool: (
          input: Parameters<GuardedToolOperations['callTool']>[0],
        ): ReturnType<GuardedToolOperations['callTool']> => {
          if (state.released) {
            return Promise.reject(
              new Error(
                'This managed harness handle has been released and can no longer be used. Open the harness again to continue working with the session; releasing never cancels admitted durable work',
              ),
            );
          }
          return nativeTools.callTool(input);
        },
      };
    }
    this.release = async () => {
      if (this.#state.released) {
        return;
      }
      this.#state.released = true;
      await this.#service.releaseReference(this.#live, this);
    };
  }

  /** Marks the handle released without releasing its reference. */
  markInvalidated(): void {
    this.#state.released = true;
  }
}

/**
 * The default {@link AiService} implementation.
 *
 * @remarks
 *
 * Wave 0 scaffold: it owns session ownership checks, single-flight namespace
 * acquisition with per-acquisition authority binding, reference counting,
 * release semantics, the mediated harness view, configuration initialization
 * of new conversations, registry version identity, and shutdown-safe opens.
 * The storage, lease, and guard integration is Wave 1 and fails closed here.
 *
 * @internal
 */
export class DefaultAiService implements AiService {
  readonly #deps: DefaultAiServiceDeps;
  readonly #integration: AiServiceIntegration | undefined;
  readonly #live = new Map<string, LiveNamespace>();
  readonly #locks = new Map<string, Promise<unknown>>();
  #closed = false;

  static create(options: DefaultAiServiceOptions): DefaultAiService {
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

    this.assertNotClosed(pluginId, options.sessionId);

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
    const binding: AcquisitionBinding = {
      namespace: { pluginId, sessionId: options.sessionId },
      owner,
      credentials: options.credentials,
      registry: options.registry,
      registryVersion: options.registryVersion,
      ...(parsedConfig.model === undefined
        ? {}
        : { model: parsedConfig.model }),
    };
    const key = namespaceKey(binding.namespace);
    const configKey = configKeyOf(options.config, parsedConfig);

    return this.exclusive(key, async () => {
      // Re-check inside the queue: a shutdown may have started while this
      // acquisition waited for the namespace.
      this.assertNotClosed(pluginId, options.sessionId);

      const ownership = await this.#integration!.ensureSessionOwnership(
        binding,
      );
      if (ownership.owner !== owner) {
        throw new Error(
          `Access denied: the AI session '${options.sessionId}' of the '${pluginId}' plugin is owned by '${ownership.owner}' and cannot be opened by '${owner}'. Session ownership is fixed when the session is created`,
        );
      }
      this.assertNotClosed(pluginId, options.sessionId);

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
        await this.#integration!.bindAcquisition(binding);
        this.assertNotClosed(pluginId, options.sessionId);
        const handle = new ManagedHarnessHandle(this, live);
        live.references.add(handle);
        return handle;
      }

      await this.#integration!.bindAcquisition(binding);
      this.assertNotClosed(pluginId, options.sessionId);

      const nativeHandle = await this.#integration!.openNativeHarness({
        ...binding,
        configVersion: configKey,
        conversationCreated: conversationCreatedHook(parsedConfig),
      });
      if (this.#closed) {
        // Shutdown won the race: do not publish the handle, and clean up the
        // resources this acquisition just created.
        try {
          await this.#integration!.releaseNativeHarness(nativeHandle);
        } catch (error) {
          this.#deps.logger.warn(
            `Failed to clean up an AI harness for the '${pluginId}' plugin after shutdown: ${error}`,
          );
        }
        this.assertNotClosed(pluginId, options.sessionId);
      }
      const newLive: LiveNamespace = {
        namespace: binding.namespace,
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

  private assertNotClosed(pluginId: string, sessionId: string): void {
    if (this.#closed) {
      throw new Error(
        `The AI service of the '${pluginId}' plugin is shut down and no longer accepts opens; the AI session '${sessionId}' was not opened`,
      );
    }
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

  /**
   * Drains a namespace whose lease was invalidated: every live handle of the
   * namespace rejects further operations, and the underlying harness is
   * closed so in-flight guarded work aborts. A stale lease release never
   * affects a successor's lease.
   */
  invalidateNamespace(namespace: Namespace): void {
    const key = namespaceKey(namespace);
    const live = this.#live.get(key);
    if (live === undefined) {
      return;
    }
    this.#live.delete(key);
    for (const handle of live.references) {
      handle.markInvalidated();
    }
    void this.#integration?.releaseNativeHarness(live.handle).catch(error => {
      this.#deps.logger.warn(
        `Failed to drain the invalidated AI session '${namespace.sessionId}' of the '${namespace.pluginId}' plugin: ${error}`,
      );
    });
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

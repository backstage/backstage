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

import type {
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import type {
  TaskCompletionState,
  TaskContext,
  TaskSecrets,
} from '@backstage/plugin-scaffolder-node';
import type { UpdateTaskCheckpointOptions } from '@backstage/plugin-scaffolder-node/alpha';
import { JsonObject, JsonValue } from '@backstage/types';
import { TaskRedacter } from './TaskRedacter';
import type { UpdateStepStateOptions } from './types';
import {
  collectCredentialSecretValues,
  collectTaskSecretValues,
} from './taskSecrets';

export type WorkflowEnvironment = {
  parameters: JsonObject;
  secrets?: TaskSecrets;
};

export interface SystemSecretProvider {
  subscribe(listener: (secrets: ReadonlySet<string>) => void): {
    secrets: ReadonlySet<string>;
    unsubscribe(): void;
  };
}

type InternalTaskContext = TaskContext & {
  setTaskLogger?(logger: LoggerService): void;
};

function collectStrings(value: JsonValue, includeKeys: boolean): string[] {
  const result: string[] = [];
  const visit = (item: JsonValue): void => {
    if (typeof item === 'string') {
      result.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(visit);
    } else if (item && typeof item === 'object') {
      for (const [key, child] of Object.entries(item)) {
        if (includeKeys) {
          result.push(key);
        }
        if (child !== undefined) {
          visit(child);
        }
      }
    }
  };
  visit(value);
  return result;
}

function collectRecoveredStateStrings(state: JsonObject): string[] {
  const result: string[] = [];
  const collectPayload = (value: unknown): void => {
    if (value !== undefined) {
      result.push(...collectStrings(value as JsonValue, true));
    }
  };

  const checkpoints = state.checkpoints;
  if (checkpoints && typeof checkpoints === 'object') {
    for (const checkpoint of Object.values(checkpoints)) {
      if (checkpoint && typeof checkpoint === 'object') {
        collectPayload((checkpoint as JsonObject).value);
      }
    }
  }

  const steps = state.steps;
  if (steps && typeof steps === 'object') {
    for (const step of Object.values(steps)) {
      if (step && typeof step === 'object') {
        collectPayload((step as JsonObject).output);
      }
    }
  }

  return result;
}

class RedactingLogger implements LoggerService {
  constructor(
    private readonly getLogger: () => LoggerService,
    private readonly redacter: TaskRedacter,
    private readonly assertReady: () => void,
  ) {}

  #redactMeta(meta: JsonObject): JsonObject {
    try {
      if (meta instanceof Error) {
        return this.redacter.redactError(meta) as unknown as JsonObject;
      }
    } catch {
      return this.redacter.redactError(meta) as unknown as JsonObject;
    }
    return this.redacter.redactJson(meta) as JsonObject;
  }

  #write(write: (logger: LoggerService) => void): void {
    try {
      this.assertReady();
      write(this.getLogger());
    } catch (error) {
      throw this.redacter.redactError(error);
    }
  }

  error(message: string, meta?: JsonObject): void {
    const redactedMessage = this.redacter.redactString(message);
    this.#write(logger => {
      if (meta) {
        logger.error(redactedMessage, this.#redactMeta(meta));
      } else {
        logger.error(redactedMessage);
      }
    });
  }

  warn(message: string, meta?: JsonObject): void {
    const redactedMessage = this.redacter.redactString(message);
    this.#write(logger => {
      if (meta) {
        logger.warn(redactedMessage, this.#redactMeta(meta));
      } else {
        logger.warn(redactedMessage);
      }
    });
  }

  info(message: string, meta?: JsonObject): void {
    const redactedMessage = this.redacter.redactString(message);
    this.#write(logger => {
      if (meta) {
        logger.info(redactedMessage, this.#redactMeta(meta));
      } else {
        logger.info(redactedMessage);
      }
    });
  }

  debug(message: string, meta?: JsonObject): void {
    const redactedMessage = this.redacter.redactString(message);
    this.#write(logger => {
      if (meta) {
        logger.debug(redactedMessage, this.#redactMeta(meta));
      } else {
        logger.debug(redactedMessage);
      }
    });
  }

  child(meta: JsonObject): LoggerService {
    try {
      this.assertReady();
      return new RedactingLogger(
        () =>
          this.getLogger().child(this.redacter.redactJson(meta) as JsonObject),
        this.redacter,
        this.assertReady,
      );
    } catch (error) {
      throw this.redacter.redactError(error);
    }
  }
}

class RedactingTaskContext implements TaskContext {
  constructor(
    private readonly context: TaskRunContext,
    private readonly delegate: TaskContext,
  ) {}

  get taskId() {
    return this.delegate.taskId;
  }

  get spec() {
    return this.delegate.spec;
  }

  get secrets() {
    return this.delegate.secrets;
  }

  get createdBy() {
    return this.delegate.createdBy;
  }

  get cancelSignal() {
    return this.delegate.cancelSignal;
  }

  get done() {
    return this.delegate.done;
  }

  get isDryRun() {
    return this.delegate.isDryRun;
  }

  async #call<T>(operation: () => Promise<T>): Promise<T> {
    try {
      await this.context.waitUntilReady();
      return await operation();
    } catch (error) {
      throw this.context.redacter.redactError(error);
    }
  }

  async complete(
    result: TaskCompletionState,
    metadata?: JsonObject,
  ): Promise<void> {
    await this.#call(async () => {
      await this.delegate.complete(
        result,
        metadata
          ? (this.context.redacter.redactJson(metadata) as JsonObject)
          : undefined,
      );
    });
  }

  async emitLog(message: string, logMetadata?: JsonObject): Promise<void> {
    if (logMetadata) {
      await this.#call(() =>
        this.delegate.emitLog(
          this.context.redacter.redactString(message),
          this.context.redacter.redactJson(logMetadata) as JsonObject,
        ),
      );
    } else {
      await this.#call(() =>
        this.delegate.emitLog(this.context.redacter.redactString(message)),
      );
    }
  }

  getTaskState(): Promise<{ state?: JsonObject } | undefined> {
    return this.#call(async () => {
      const result = await this.delegate.getTaskState?.();
      if (result?.state) {
        this.context.addSensitiveValues(
          collectRecoveredStateStrings(result.state),
        );
      }
      return result;
    });
  }

  async updateCheckpoint(options: UpdateTaskCheckpointOptions): Promise<void> {
    if (!this.delegate.updateCheckpoint) {
      return;
    }
    await this.#call(async () => {
      const projected =
        options.status === 'failed'
          ? {
              ...options,
              reason: this.context.redacter.redactString(options.reason),
            }
          : options;
      await this.delegate.updateCheckpoint!(projected);
    });
  }

  async serializeWorkspace(options: { path: string }): Promise<void> {
    if (!this.delegate.serializeWorkspace) {
      return;
    }
    await this.#call(() => this.delegate.serializeWorkspace!(options));
  }

  cleanWorkspace(): Promise<void> {
    return this.#call(
      () => this.delegate.cleanWorkspace?.() ?? Promise.resolve(),
    );
  }

  rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void> {
    return this.#call(
      () => this.delegate.rehydrateWorkspace?.(options) ?? Promise.resolve(),
    );
  }

  async updateStepState(options: UpdateStepStateOptions): Promise<void> {
    if (!this.delegate.updateStepState) {
      return;
    }
    await this.#call(() => this.delegate.updateStepState!(options));
  }

  getWorkspaceName(): Promise<string> {
    return this.#call(() => this.delegate.getWorkspaceName());
  }

  getInitiatorCredentials(): Promise<BackstageCredentials> {
    return this.#call(async () => {
      let credentials: BackstageCredentials;
      try {
        credentials = await this.delegate.getInitiatorCredentials();
      } catch {
        throw new Error('Failed to retrieve task initiator credentials');
      }
      let values: string[];
      try {
        values = collectCredentialSecretValues(credentials);
      } catch {
        throw new Error('Failed to inspect task initiator credentials');
      }
      this.context.addSensitiveValues(values);
      return credentials;
    });
  }
}

/** Required internal context for one Scaffolder task execution attempt. */
export class TaskRunContext {
  readonly redacter = new TaskRedacter();
  readonly logger: LoggerService;
  readonly task: TaskContext;

  #environment: WorkflowEnvironment;
  readonly #delegate: InternalTaskContext;
  readonly #loadEnvironment: () => Promise<WorkflowEnvironment>;
  readonly #systemSubscription: {
    secrets: ReadonlySet<string>;
    unsubscribe(): void;
  };
  #environmentRefresh = Promise.resolve();
  #refreshPending = 0;
  #initializationError: Error | undefined;
  #disposed = false;

  static async create(options: {
    task: InternalTaskContext;
    logger: LoggerService;
    systemSecrets: SystemSecretProvider;
    environment?: WorkflowEnvironment;
    loadEnvironment: () => Promise<WorkflowEnvironment>;
  }): Promise<TaskRunContext> {
    const context = new TaskRunContext(options);
    try {
      if (!options.environment) {
        context.#environment = await options.loadEnvironment();
      }
      const environmentSecrets = Object.values(
        context.environment.secrets ?? {},
      );
      context.redacter.add(environmentSecrets);
    } catch {
      context.#failInitialization();
    }
    return context;
  }

  private constructor(options: {
    task: InternalTaskContext;
    logger: LoggerService;
    systemSecrets: SystemSecretProvider;
    environment?: WorkflowEnvironment;
    loadEnvironment: () => Promise<WorkflowEnvironment>;
  }) {
    this.#delegate = options.task;
    this.#environment = options.environment ?? { parameters: {} };
    this.#loadEnvironment = options.loadEnvironment;
    this.logger = new RedactingLogger(
      () => options.logger,
      this.redacter,
      () => this.assertReadyForSynchronousEgress(),
    );
    this.task = new RedactingTaskContext(this, options.task);
    let taskSecrets: TaskSecrets | undefined;
    try {
      taskSecrets = this.#delegate.secrets;
      const taskSecretValues = collectTaskSecretValues(taskSecrets, {
        strictCredentials: true,
      });
      this.redacter.add(taskSecretValues);
    } catch {
      this.#failInitialization();
    }

    try {
      this.#systemSubscription = options.systemSecrets.subscribe(secrets => {
        this.redacter.add(secrets);
        this.#refreshPending += 1;
        this.#environmentRefresh = this.#environmentRefresh
          .then(async () => {
            if (this.#disposed) {
              return;
            }
            const environment = await this.#loadEnvironment();
            const environmentSecrets = Object.values(environment.secrets ?? {});
            this.redacter.add(environmentSecrets);
          })
          .catch(() => this.#failInitialization())
          .finally(() => {
            this.#refreshPending -= 1;
          });
      });
      this.redacter.add(this.#systemSubscription.secrets);
    } catch {
      this.#systemSubscription = {
        secrets: new Set(),
        unsubscribe() {},
      };
      this.#failInitialization();
    }

    try {
      this.#delegate.setTaskLogger?.(this.logger);
    } catch {
      this.#failInitialization();
    }
  }

  get environment(): WorkflowEnvironment {
    return this.#environment;
  }

  registerSensitiveValue(value: JsonValue): void {
    this.addSensitiveValues(collectStrings(value, true));
  }

  addSensitiveValues(values: Iterable<string>): void {
    this.redacter.add(values);
  }

  #failInitialization(): void {
    this.#initializationError ??= new Error(
      'Failed to initialize task secret redaction',
    );
  }

  assertInitialized(): void {
    if (this.#initializationError) {
      throw this.redacter.redactError(this.#initializationError);
    }
  }

  get initializationError(): Error | undefined {
    return this.#initializationError;
  }

  assertReadyForSynchronousEgress(): void {
    this.assertInitialized();
    if (this.#refreshPending > 0) {
      throw new Error('Task secret redaction is refreshing');
    }
  }

  async waitUntilReady(): Promise<void> {
    await this.#environmentRefresh;
    this.assertInitialized();
  }

  async dispose(): Promise<void> {
    this.#disposed = true;
    this.#systemSubscription.unsubscribe();
    await this.#environmentRefresh;
  }
}

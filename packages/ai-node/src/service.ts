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

import { eventsServiceRef } from '@backstage/plugin-events-node';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import type { ServiceRef } from '@backstage/backend-plugin-api';
import { DefaultAiService } from './DefaultAiService';
import type { AiService } from './contracts';
import type { Config } from '@backstage/config';
import type { DefaultAiServiceDeps } from './DefaultAiService';
import type { AiProviderModule } from './providers/types';
import type { AiModuleRegistry } from './moduleRegistry';
import {
  createAiServiceIntegration,
  type AiCodemodeOptions,
  type CredentialRefreshHook,
} from './integration';
import type { ToolModule } from './tools/types';
import { runAiMigrations } from './migrations';
import {
  AI_INSTALLATION_CONFIG_PATH,
  configureAiInstallation,
} from './config-extension/index';

/**
 * Plugin-scoped {@link AiService} giving backend plugins the managed, low-level
 * Pi Durable primitive.
 *
 * @remarks
 *
 * Each consuming plugin gets its own service instance whose factory composes
 * the native database, root configuration, auth, permissions, logger,
 * auditor, lifecycle, and plugin metadata services. The factory initializes eagerly
 * (`initialization: 'always'`) so that the module participates in startup
 * enumeration, as required by the ownership and recovery design.
 *
 * The default factory runs the AI migrations, reads the installation
 * configuration at {@link AI_INSTALLATION_CONFIG_PATH}, wires the production
 * integration — exclusive namespace lease with startup recovery, fenced Knex
 * Pi storage, guarded model operations with per-attempt permission checks,
 * scoped credential stores, the canonical model catalog, and the durable
 * attempt journal — and drains local handles when a lease is invalidated.
 * Installations that configure nothing keep the fail-closed default: model
 * dispatch is denied with an actionable reason and no model resolves.
 *
 * @alpha
 */
export type AiServiceFactoryOptions = Readonly<{
  /**
   * Tool server modules to register with the service. Each declared tool
   * becomes a guarded, journaled tool dispatch — mediated exactly like model
   * dispatch — with its scoped MCP credential and its own permission. The
   * default factory registers none.
   */
  toolModules?: readonly ToolModule[];
  /** Trusted provider modules available to new harness admissions. */
  providerModules?: readonly AiProviderModule[];
  /**
   * Opt-in code mode for every harness this service opens. The
   * `createExtension` callback builds the extension; the default
   * construction is `createBoundedCodemodeExtension` from
   * `@backstage/ai-node-codemode`.
   */
  codemode?: AiCodemodeOptions;
  /**
   * Guarded pre-dispatch OAuth refresh.
   *
   * @remarks
   * An explicit hook here overrides the config-driven default: when
   * `ai.credentials.tokenEndpoints` declares a provider whose registered family
   * carries an auth module, the service wires refresh itself, so the standard
   * configuration needs nothing here. Supply a hook for a provider whose auth
   * module is not part of a registered family, or to replace the refresh
   * machinery entirely; build it with `createCredentialRefreshHook` from
   * `@backstage/ai-node/alpha` to keep the guarded, journaled behavior.
   */
  refreshExpiredCredential?: CredentialRefreshHook;
}>;

/**
 * Creates an AI service factory with explicit provider and tool modules.
 * This override does not consume AI backend extension-point registrations.
 *
 * @alpha
 */
export function createAiServiceFactory(options: AiServiceFactoryOptions = {}) {
  return makeAiServiceFactory(options, false);
}

const dynamicRegistries = new WeakMap<
  AiService,
  { current?: AiModuleRegistry }
>();

/** Binds backend module registrations to the default AI service. @alpha */
export function bindAiModuleRegistry(
  service: AiService,
  registry: AiModuleRegistry,
): void {
  const slot = dynamicRegistries.get(service);
  if (slot) slot.current = registry;
}

/** Creates a private plugin-scoped AI service with explicit modules. @alpha */
export async function createPrivateAiService(
  options: AiServiceFactoryOptions & {
    deps: DefaultAiServiceDeps;
    config: Config;
  },
): Promise<AiService> {
  return createConfiguredService(options.deps, options.config, options, false);
}

async function createConfiguredService(
  deps: DefaultAiServiceDeps,
  config: Config,
  options: AiServiceFactoryOptions,
  dynamic: boolean,
): Promise<AiService> {
  await runAiMigrations({ database: deps.database, logger: deps.logger });
  const installation = configureAiInstallation({
    source: { root: config, path: AI_INSTALLATION_CONFIG_PATH },
    db: await deps.database.getClient(),
  });
  const slot: { current?: AiModuleRegistry } = {};
  const integration = await createAiServiceIntegration({
    deps,
    providerModules: options.providerModules ?? [],
    toolModules: options.toolModules ?? [],
    ...(options.codemode === undefined ? {} : { codemode: options.codemode }),
    ...(options.refreshExpiredCredential === undefined
      ? {}
      : { refreshExpiredCredential: options.refreshExpiredCredential }),
    ...(dynamic
      ? {
          moduleSource: () =>
            slot.current?.snapshot() ?? {
              providerModules: [],
              toolModules: [],
            },
        }
      : {}),
    ...installation,
  });
  const service = DefaultAiService.create({ deps, integration });
  integration.onNamespaceInvalidated(namespace =>
    service.invalidateNamespace(namespace),
  );
  if (dynamic) dynamicRegistries.set(service, slot);
  return service;
}

function makeAiServiceFactory(
  options: AiServiceFactoryOptions,
  dynamic: boolean,
) {
  return <TService extends AiService>(
    service: ServiceRef<TService, 'plugin'>,
  ) =>
    createServiceFactory({
      service,
      deps: {
        database: coreServices.database,
        config: coreServices.rootConfig,
        auth: coreServices.auth,
        permissions: coreServices.permissions,
        logger: coreServices.logger,
        auditor: coreServices.auditor,
        lifecycle: coreServices.lifecycle,
        pluginMetadata: coreServices.pluginMetadata,
        events: eventsServiceRef,
      },
      initialization: 'always',
      async factory(deps) {
        return (await createConfiguredService(
          deps,
          deps.config,
          options,
          dynamic,
        )) as TService;
      },
    });
}

/**
 * Plugin-scoped {@link AiService} giving backend plugins the managed, low-level
 * Pi Durable primitive, with the default factory behavior described on
 * {@link createAiServiceFactory}.
 *
 * @alpha
 */
export const aiServiceRef = createServiceRef<AiService>({
  id: 'ai',
  scope: 'plugin',
  defaultFactory: async service => makeAiServiceFactory({}, true)(service),
});

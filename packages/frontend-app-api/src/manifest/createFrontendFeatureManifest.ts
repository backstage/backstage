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

import {
  AppNode,
  ExtensionDataRef,
  FrontendFeature,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  Extension,
  toInternalExtension,
} from '../../../frontend-plugin-api/src/wiring/resolveExtensionDefinition';
import { FrontendExtensionManifest, FrontendFeatureManifest } from './types';
import { PREDICATE_FUNCTION_DATA_PAIRS } from './predicateFunctions';
import { findSyncPartMismatch, getPluginExtensionIds } from './syncPart';

type PluginLike = {
  pluginId: string;
  title?: string;
  routes: { [name: string]: unknown };
  externalRoutes: { [name: string]: unknown };
};

function parseKind(id: string): string | undefined {
  const index = id.indexOf(':');
  return index > 0 ? id.slice(0, index) : undefined;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readConfigSchema(
  extension: Extension<unknown>,
): { [key: string]: unknown } | undefined {
  try {
    return extension.configSchema?.schema().schema;
  } catch {
    return undefined;
  }
}

/**
 * Runs the factory of an extension once, with stubbed dependencies and the
 * default config, and returns the data it outputs keyed by extension data ID.
 */
function runFactoryOnce(
  extension: Extension<unknown>,
  plugin: PluginLike,
): Map<string, unknown> {
  const internal = toInternalExtension(extension);
  const config = internal.configSchema?.parse({}) ?? {};
  const node = {
    spec: {
      id: internal.id,
      attachTo: internal.attachTo,
      extension: internal,
      disabled: internal.disabled,
      plugin,
    },
    edges: { attachments: new Map() },
    instance: undefined,
  } as unknown as AppNode;
  const apis = { get: () => undefined };

  const data = new Map<string, unknown>();
  if (internal.version === 'v1') {
    const inputs = Object.fromEntries(
      Object.keys(internal.inputs).map(name => [name, []]),
    );
    const outputs = internal.factory({ node, apis, config, inputs });
    for (const [name, value] of Object.entries(outputs)) {
      const ref: ExtensionDataRef | undefined = internal.output[name];
      if (ref) {
        data.set(ref.id, value);
      }
    }
  } else {
    const inputs = Object.fromEntries(
      Object.keys(internal.inputs).map(name => [name, []]),
    );
    for (const value of internal.factory({
      node,
      apis,
      config,
      inputs: inputs as any,
    })) {
      data.set(value.id, value.value);
    }
  }
  return data;
}

function findRouteRefName(
  plugin: PluginLike,
  routeRef: unknown,
): string | undefined {
  return Object.entries(plugin.routes).find(([, ref]) => ref === routeRef)?.[0];
}

/** Reads the routing data that a page extension outputs. */
function extractPageManifest(
  extension: Extension<unknown>,
  plugin: PluginLike,
): NonNullable<FrontendExtensionManifest['page']> {
  const data = runFactoryOnce(extension, plugin);

  const path = data.get(coreExtensionData.routePath.id);
  if (typeof path !== 'string') {
    throw new Error(`Page '${extension.id}' did not output a route path`);
  }
  const title = data.get(coreExtensionData.title.id);
  const routeRef = data.get(coreExtensionData.routeRef.id);
  const routeRefName = routeRef
    ? findRouteRefName(plugin, routeRef)
    : undefined;

  return {
    path,
    ...(typeof title === 'string' ? { title } : {}),
    ...(routeRefName ? { routeRefName } : {}),
  };
}

function isJsonValue(value: unknown): boolean {
  if (value === null) {
    return true;
  }
  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return typeof value !== 'number' || Number.isFinite(value);
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  if (typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return false;
    }
    return Object.values(value as object).every(isJsonValue);
  }
  return false;
}

/**
 * Reads the outputs of an extension that renders a React element outside of
 * app/routes. Returns undefined if the extension doesn't output an element.
 */
function extractElementManifest(
  extension: Extension<unknown>,
  plugin: PluginLike,
): FrontendExtensionManifest['element'] {
  const internal = toInternalExtension(extension);
  const outputRefs: ExtensionDataRef[] =
    internal.version === 'v1'
      ? Object.values(internal.output)
      : internal.output;
  if (!outputRefs.some(ref => ref.id === coreExtensionData.reactElement.id)) {
    return undefined;
  }
  if (Object.keys(internal.inputs).length > 0) {
    throw new Error(`'${extension.id}' has inputs`);
  }

  const outputs = runFactoryOnce(extension, plugin);
  const data: { [dataRefId: string]: unknown } = {};
  const predicateFunctions: { [functionDataRefId: string]: string } = {};
  let routeRefName: string | undefined;
  for (const [id, value] of outputs) {
    if (id === coreExtensionData.reactElement.id) {
      continue;
    }
    if (id === coreExtensionData.routeRef.id) {
      routeRefName = findRouteRefName(plugin, value);
      if (!routeRefName) {
        throw new Error(
          `'${extension.id}' outputs a route ref that isn't one of the plugin routes`,
        );
      }
      continue;
    }
    // A function that was created from a predicate is recreated by the stub
    // from the predicate, which is stored as regular data.
    const predicateDataRefId = PREDICATE_FUNCTION_DATA_PAIRS.get(id);
    if (
      typeof value === 'function' &&
      predicateDataRefId &&
      outputs.has(predicateDataRefId)
    ) {
      predicateFunctions[id] = predicateDataRefId;
      continue;
    }
    if (!isJsonValue(value)) {
      throw new Error(
        `'${extension.id}' outputs '${id}' data that can't be stored as JSON`,
      );
    }
    data[id] = value;
  }

  return {
    data,
    ...(routeRefName ? { routeRefName } : {}),
    ...(Object.keys(predicateFunctions).length > 0
      ? { predicateFunctions }
      : {}),
  };
}

function hasIfPredicate(extension: Extension<unknown>): boolean {
  const internal = toInternalExtension(extension);
  return internal.version === 'v2' && internal.if !== undefined;
}

function isAttachedTo(attachTo: unknown, id: string, input: string): boolean {
  const target = attachTo as { id?: string; input?: string };
  return (
    !Array.isArray(attachTo) && target?.id === id && target?.input === input
  );
}

function isRoutesAttachment(attachTo: unknown): boolean {
  return isAttachedTo(attachTo, 'app/routes', 'routes');
}

/**
 * Returns why an extension prevents its plugin from being deferred, or
 * undefined if it can be deferred.
 */
function getNotDeferrableReason(
  extension: FrontendExtensionManifest,
  usesIfPredicate: boolean,
): string | undefined {
  if (usesIfPredicate) {
    return `extension '${extension.id}' uses an 'if' predicate`;
  }
  if (extension.kind === 'page') {
    return isRoutesAttachment(extension.attachTo)
      ? undefined
      : `page '${extension.id}' does not attach to app/routes`;
  }
  if (extension.kind === 'api') {
    return isAttachedTo(extension.attachTo, 'root', 'apis')
      ? undefined
      : `API '${extension.id}' does not attach to root`;
  }
  if (!extension.element) {
    return `has extension '${extension.id}' that is not a page, an API, or an element`;
  }
  if (Array.isArray(extension.attachTo)) {
    return `extension '${extension.id}' attaches to more than one extension`;
  }
  return undefined;
}

/**
 * Creates a build-time manifest that describes the extensions of a frontend
 * plugin or module, without needing to instantiate an app.
 *
 * @remarks
 *
 * This never throws for a broken plugin. Instead the returned manifest is
 * marked as not deferrable, with the reason that extraction failed.
 *
 * @alpha
 */
export async function createFrontendFeatureManifest(
  feature: FrontendFeature,
  options?: {
    /**
     * The default export of the `./sync` entry point of the same package, if
     * there is one. Its extensions are loaded with the app, so they don't
     * need to be deferrable.
     */
    sync?: FrontendFeature;
  },
): Promise<FrontendFeatureManifest> {
  const isPlugin = OpaqueFrontendPlugin.isType(feature);
  const isModule =
    (feature as { $$type?: string }).$$type === '@backstage/FrontendModule';
  if (!isPlugin && !isModule) {
    return {
      manifestVersion: 1,
      type: 'module',
      pluginId: (feature as { pluginId?: string }).pluginId ?? 'unknown',
      deferrable: false,
      notDeferrableReason: 'not a frontend plugin or module',
      routes: [],
      externalRoutes: [],
      extensions: [],
    };
  }

  const plugin = (isPlugin ? feature : undefined) as PluginLike | undefined;
  const pluginId = (feature as { pluginId: string }).pluginId;
  const internalExtensions: Extension<unknown>[] = isPlugin
    ? OpaqueFrontendPlugin.toInternal(feature).extensions
    : (feature as unknown as { extensions: Extension<unknown>[] }).extensions;

  const failures: string[] = [];
  const sync = options?.sync;
  if (sync) {
    const mismatch = isPlugin
      ? findSyncPartMismatch(feature, sync)
      : 'modules can not have a sync export';
    if (mismatch) {
      failures.push(mismatch);
    }
  }
  const syncExtensionIds = new Set(
    sync && OpaqueFrontendPlugin.isType(sync)
      ? getPluginExtensionIds(sync)
      : [],
  );

  const extensions = internalExtensions.map(
    (extension): FrontendExtensionManifest => {
      const id = extension.id;
      const kind = parseKind(id);
      const result: FrontendExtensionManifest = {
        id,
        kind,
        attachTo: extension.attachTo,
        disabled: extension.disabled,
      };
      const configSchema = readConfigSchema(extension);
      if (configSchema) {
        result.configSchema = configSchema;
      }
      if (syncExtensionIds.has(id)) {
        // Loaded with the app from the sync export, so nothing to extract
        result.sync = true;
      } else if (plugin && kind === 'page') {
        try {
          result.page = extractPageManifest(extension, plugin);
        } catch (error) {
          failures.push(
            `could not extract page '${id}': ${errorMessage(error)}`,
          );
        }
      } else if (plugin && kind !== 'api') {
        try {
          const element = extractElementManifest(extension, plugin);
          if (element) {
            result.element = element;
          }
        } catch (error) {
          failures.push(
            `could not extract element '${id}': ${errorMessage(error)}`,
          );
        }
      }
      return result;
    },
  );

  let notDeferrableReason: string | undefined;
  if (!plugin) {
    notDeferrableReason = 'modules are never deferred';
  } else if (extensions.length === 0) {
    notDeferrableReason = 'plugin has no extensions';
  } else if (failures.length > 0) {
    notDeferrableReason = failures[0];
  } else {
    notDeferrableReason = extensions
      .map((extension, index) =>
        extension.sync
          ? undefined
          : getNotDeferrableReason(
              extension,
              hasIfPredicate(internalExtensions[index]),
            ),
      )
      .find(Boolean);
    // Only rendering a page or element loads a deferred plugin, so a plugin
    // without one would never be loaded.
    if (!notDeferrableReason && !extensions.some(e => e.page || e.element)) {
      notDeferrableReason = extensions.some(e => e.sync)
        ? 'every page and element is in the sync export, so there is nothing to defer'
        : 'has no page or element that would load it';
    }
  }

  return {
    manifestVersion: 1,
    type: plugin ? 'plugin' : 'module',
    pluginId,
    ...(plugin?.title ? { title: plugin.title } : {}),
    deferrable: !notDeferrableReason,
    ...(notDeferrableReason ? { notDeferrableReason } : {}),
    routes: Object.keys(plugin?.routes ?? {}),
    externalRoutes: Object.keys(plugin?.externalRoutes ?? {}),
    extensions,
  };
}

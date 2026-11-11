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
import { getJsonType } from './deferredConfig';
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
 * Runs the factory of an extension once, with stubbed dependencies, and
 * returns the data it outputs keyed by extension data ID.
 */
function runFactoryOnce(
  extension: Extension<unknown>,
  plugin: PluginLike,
  configInput: { [key: string]: unknown } = {},
): Map<string, unknown> {
  const internal = toInternalExtension(extension);
  const config = internal.configSchema?.parse(configInput) ?? {};
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

  const element = readElementOutputs(
    extension,
    plugin,
    runFactoryOnce(extension, plugin),
  );
  const { dataConfigKeys, configPassThrough } = findConfigKeyEffects(
    extension,
    plugin,
    element,
  );
  return {
    ...element,
    ...(dataConfigKeys.length > 0 ? { dataConfigKeys } : {}),
    ...(Object.keys(configPassThrough).length > 0 ? { configPassThrough } : {}),
  };
}

type ElementOutputs = {
  data: { [dataRefId: string]: unknown };
  routeRefName?: string;
  predicateFunctions?: { [functionDataRefId: string]: string };
};

function readElementOutputs(
  extension: Extension<unknown>,
  plugin: PluginLike,
  outputs: Map<string, unknown>,
): ElementOutputs {
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

type JsonSchema = {
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  items?: JsonSchema;
  properties?: { [key: string]: JsonSchema };
};

/**
 * Creates values that a config property could be set to, used to check
 * whether the property changes the outputs of an extension. Returns an empty
 * list for schemas that it can't create values for.
 */
function createProbeValues(schema: JsonSchema): unknown[] {
  if (schema.const !== undefined) {
    return [schema.const];
  }
  if (schema.enum) {
    return schema.enum;
  }
  const branches = schema.anyOf ?? schema.oneOf;
  if (branches) {
    return branches.flatMap(createProbeValues);
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  return types.flatMap((type): unknown[] => {
    switch (type) {
      case 'string':
        return ['deferred-config-probe', 'deferred-config-probe-2'];
      case 'number':
      case 'integer':
        return [7, 8];
      case 'boolean':
        return [true, false];
      case 'array':
        return [[], ...createProbeValues(schema.items ?? {}).map(v => [v])];
      default:
        return [];
    }
  });
}

type ConfigKeyEffects = {
  dataConfigKeys: string[];
  configPassThrough: NonNullable<
    NonNullable<FrontendExtensionManifest['element']>['configPassThrough']
  >;
};

/**
 * Finds the config keys that change the data outputs of an element. Config
 * for these keys can't be applied before the plugin is loaded, since the stub
 * only has the outputs from the default config. A key is included if it isn't
 * possible to tell whether it changes the outputs.
 *
 * Keys whose value is output unchanged as a single data value are also
 * recorded as pass-through keys, for the JSON types of values where that is
 * the case, so that the stub can apply them.
 */
function findConfigKeyEffects(
  extension: Extension<unknown>,
  plugin: PluginLike,
  defaults: ElementOutputs,
): ConfigKeyEffects {
  const effects: ConfigKeyEffects = {
    dataConfigKeys: [],
    configPassThrough: {},
  };
  const properties = (readConfigSchema(extension) as JsonSchema | undefined)
    ?.properties;
  if (!properties) {
    return effects;
  }

  for (const [key, schema] of Object.entries(properties)) {
    const values = createProbeValues(schema);
    if (values.length === 0) {
      effects.dataConfigKeys.push(key);
      continue;
    }

    let changesData = false;
    // For each JSON type, the data ref the value is passed through to, or
    // false if values of that type change the data in other ways
    const passThroughByType = new Map<string, string | undefined | false>();
    for (const value of values) {
      const type = getJsonType(value);
      let effect: { changed: boolean; dataRefId?: string } | false;
      try {
        const outputs = runFactoryOnce(extension, plugin, { [key]: value });
        const probed = readElementOutputs(extension, plugin, outputs);
        effect = findPassThroughDataRef(defaults, probed, value);
      } catch {
        effect = false;
      }
      if (effect === false || effect.changed) {
        changesData = true;
      }
      const current = passThroughByType.get(type);
      if (effect === false || current === false) {
        passThroughByType.set(type, false);
      } else if (effect.dataRefId) {
        passThroughByType.set(
          type,
          current === undefined || current === effect.dataRefId
            ? effect.dataRefId
            : false,
        );
      } else if (!passThroughByType.has(type)) {
        passThroughByType.set(type, undefined);
      }
    }

    if (!changesData) {
      continue;
    }
    effects.dataConfigKeys.push(key);
    const passThrough = Array.from(passThroughByType).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    );
    const dataRefIds = new Set(passThrough.map(([, id]) => id));
    if (dataRefIds.size === 1) {
      effects.configPassThrough[key] = {
        dataRefId: Array.from(dataRefIds)[0],
        types: passThrough.map(([type]) => type),
      };
    }
  }
  return effects;
}

/**
 * Compares the outputs for a probed config value with the defaults. Returns
 * the data ref that the value was output with unchanged, if that is the only
 * difference, or false if the outputs changed in some other way.
 */
function findPassThroughDataRef(
  defaults: ElementOutputs,
  probed: ElementOutputs,
  value: unknown,
): { changed: boolean; dataRefId?: string } | false {
  const { data: defaultData, ...defaultRest } = defaults;
  const { data: probedData, ...probedRest } = probed;
  const ids = new Set([
    ...Object.keys(defaultData),
    ...Object.keys(probedData),
  ]);
  const changedIds = Array.from(ids).filter(
    id => JSON.stringify(defaultData[id]) !== JSON.stringify(probedData[id]),
  );
  const restChanged =
    JSON.stringify(defaultRest) !== JSON.stringify(probedRest);
  if (changedIds.length === 0 && !restChanged) {
    return { changed: false };
  }
  if (
    !restChanged &&
    changedIds.length === 1 &&
    JSON.stringify(probedData[changedIds[0]]) === JSON.stringify(value)
  ) {
    return { changed: true, dataRefId: changedIds[0] };
  }
  return false;
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

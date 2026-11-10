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
 * Runs the factory of a page extension once, with stubbed dependencies, and
 * reads the routing data it outputs.
 */
function extractPageManifest(
  extension: Extension<unknown>,
  plugin: PluginLike,
): NonNullable<FrontendExtensionManifest['page']> {
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

  const path = data.get(coreExtensionData.routePath.id);
  if (typeof path !== 'string') {
    throw new Error(`Page '${internal.id}' did not output a route path`);
  }
  const title = data.get(coreExtensionData.title.id);
  const routeRef = data.get(coreExtensionData.routeRef.id);
  const routeRefName = routeRef
    ? Object.entries(plugin.routes).find(([, ref]) => ref === routeRef)?.[0]
    : undefined;

  return {
    path,
    ...(typeof title === 'string' ? { title } : {}),
    ...(routeRefName ? { routeRefName } : {}),
  };
}

function isRoutesAttachment(attachTo: unknown): boolean {
  const target = attachTo as { id?: string; input?: string };
  return (
    !Array.isArray(attachTo) &&
    target?.id === 'app/routes' &&
    target?.input === 'routes'
  );
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
      if (plugin && kind === 'page') {
        try {
          result.page = extractPageManifest(extension, plugin);
        } catch (error) {
          failures.push(
            `could not extract page '${id}': ${errorMessage(error)}`,
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
    const other = extensions.find(e => e.kind !== 'page');
    const detached = extensions.find(e => !isRoutesAttachment(e.attachTo));
    if (other) {
      notDeferrableReason = `has non-page extension '${other.id}'`;
    } else if (detached) {
      notDeferrableReason = `page '${detached.id}' does not attach to app/routes`;
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

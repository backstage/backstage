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
  FrontendFeature,
  FrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { OpaqueFrontendPlugin } from '@internal/frontend';

function getPluginId(plugin: FrontendPlugin): string {
  return plugin.pluginId ?? OpaqueFrontendPlugin.toInternal(plugin).id;
}

/** Returns the extension IDs of a plugin, in order. */
export function getPluginExtensionIds(plugin: FrontendPlugin): string[] {
  return OpaqueFrontendPlugin.toInternal(plugin).extensions.map(e => e.id);
}

function getExtensionDefinition(plugin: FrontendPlugin, id: string): unknown {
  const getExtension = (plugin as { getExtension?(id: string): unknown })
    .getExtension;
  if (!getExtension) {
    return undefined;
  }
  try {
    return getExtension.call(plugin, id);
  } catch {
    return undefined;
  }
}

/**
 * Plugins hold a copy of each extension definition, so two plugins created
 * from the same definition object are compared by the fields of the copies,
 * which include the factory function of the definition.
 */
function isSameDefinition(a: unknown, b: unknown): boolean {
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  const aFields = a as { [key: string]: unknown };
  const bFields = b as { [key: string]: unknown };
  const keys = new Set([...Object.keys(aFields), ...Object.keys(bFields)]);
  return Array.from(keys).every(key => aFields[key] === bFields[key]);
}

/**
 * Checks that the sync part of a deferred plugin agrees with the full plugin.
 *
 * @remarks
 *
 * The sync part is the default export of the `./sync` entry point of a plugin
 * package. It must be a plugin with the same ID as the full plugin, and every
 * extension and route in it must be the same object as in the full plugin,
 * which is the case when both entry points import them from a shared module.
 * This makes sure that each extension is only registered once, from the sync
 * part, even though the full plugin contains it too. Since plugins hold
 * copies of the definitions, the copies are compared field by field.
 *
 * @returns Why the parts disagree, or undefined if they agree.
 */
export function findSyncPartMismatch(
  plugin: FrontendPlugin,
  sync: FrontendFeature,
): string | undefined {
  if (!OpaqueFrontendPlugin.isType(sync)) {
    return 'its sync export is not a frontend plugin';
  }
  const pluginId = getPluginId(plugin);
  const syncPluginId = getPluginId(sync);
  if (syncPluginId !== pluginId) {
    return `its sync export is for the '${syncPluginId}' plugin, but the main export is for the '${pluginId}' plugin`;
  }

  const pluginExtensionIds = new Set(getPluginExtensionIds(plugin));
  for (const id of getPluginExtensionIds(sync)) {
    if (!pluginExtensionIds.has(id)) {
      return `the '${id}' extension of its sync export is missing from the main export`;
    }
    if (
      !isSameDefinition(
        getExtensionDefinition(sync, id),
        getExtensionDefinition(plugin, id),
      )
    ) {
      return `the '${id}' extension is defined differently in its sync and main exports, they must use the same extension object`;
    }
  }

  for (const key of ['routes', 'externalRoutes'] as const) {
    const syncRefs = sync[key] as { [name: string]: unknown };
    const pluginRefs = plugin[key] as { [name: string]: unknown };
    for (const [name, ref] of Object.entries(syncRefs)) {
      if (pluginRefs[name] !== ref) {
        return `the '${name}' route ref in ${key} of its sync export is not the same as in the main export`;
      }
    }
  }
  return undefined;
}

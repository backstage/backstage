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

import { LoggerService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { FrontendManifest } from '../schema/openapi/generated/models';

/**
 * The name of the file that the Backstage CLI writes next to the module
 * federation manifest of a frontend plugin remote.
 */
export const BACKSTAGE_MANIFEST_FILE_NAME = 'backstage-manifest.json';

function isObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Reads the frontend section of the Backstage manifest of a remote, if it has
 * one, and keys the manifests of its exposed modules by the names of the
 * exposed modules in the module federation manifest.
 *
 * @remarks
 *
 * The Backstage manifest and its frontend section are optional, so a missing
 * or invalid file only means that the plugins of the remote are loaded with
 * the app.
 */
export function readBackstageManifest(options: {
  assetsPath: string;
  mfManifest: JsonObject;
  logger: LoggerService;
  pluginName: string;
}): FrontendManifest | undefined {
  const location = path.resolve(
    options.assetsPath,
    BACKSTAGE_MANIFEST_FILE_NAME,
  );
  if (!fs.existsSync(location)) {
    return undefined;
  }

  let content: unknown;
  try {
    content = JSON.parse(fs.readFileSync(location, 'utf8'));
  } catch (error) {
    options.logger.warn(
      `Ignoring the Backstage manifest '${location}' of dynamic frontend plugin '${options.pluginName}', since it could not be parsed`,
      error,
    );
    return undefined;
  }
  if (!isObject(content) || typeof content.manifestVersion !== 'number') {
    options.logger.warn(
      `Ignoring the Backstage manifest '${location}' of dynamic frontend plugin '${options.pluginName}', since it is invalid`,
    );
    return undefined;
  }

  // A manifest without a frontend section describes a package that isn't
  // a frontend plugin or module.
  if (content.frontend === undefined) {
    return undefined;
  }
  if (
    !isObject(content.frontend) ||
    !isObject(content.frontend.exposedModules)
  ) {
    options.logger.warn(
      `Ignoring the frontend section of the Backstage manifest in '${location}' of dynamic frontend plugin '${options.pluginName}', since it is invalid`,
    );
    return undefined;
  }

  // The exposed modules are keyed by the keys of the exposes option of the
  // build, for example "./alpha", which the module federation manifest
  // records as the path of each exposed module.
  const entryPoints = content.frontend.exposedModules;
  const exposes = Array.isArray(options.mfManifest.exposes)
    ? options.mfManifest.exposes
    : [];
  const exposedModules: FrontendManifest['exposedModules'] = {};
  for (const exposed of exposes) {
    if (!isObject(exposed) || typeof exposed.name !== 'string') {
      continue;
    }
    const exposePath =
      typeof exposed.path === 'string'
        ? exposed.path
        : `./${exposed.name}`.replace(/^\.\/\.$/, '.');
    const entry = entryPoints[exposePath];
    if (isObject(entry)) {
      exposedModules[exposed.name] = entry;
    }
  }
  return { manifestVersion: content.manifestVersion, exposedModules };
}

/*
 * Copyright 2024 The Backstage Authors
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

import { OpaqueCliModule, unwrapCliCommand } from '@internal/cli';
import { runCli } from '@backstage/cli-node';
import type { CliModule } from '@backstage/cli-node';
import { version } from './version';
import { isPromise } from 'node:util/types';

type UninitializedFeature =
  | CliModule
  | CliModule[]
  | Promise<{ default: CliModule | CliModule[] }>;

interface TaggedFeature {
  feature: CliModule;
  /**
   * Whether this module is a default, i.e. it was sourced from an array such
   * as `cli-defaults`. Defaults are a lower-priority layer that installed
   * modules override, see {@link applyOverrides}.
   */
  isDefault: boolean;
}

interface Overrides {
  packageNames: Set<string>;
  paths: Set<string>;
}

/**
 * Collects what installed modules override: their package names, and the
 * paths of their commands that have no `if` condition. Commands with `if` are
 * not collected, since they are only active for some packages.
 */
async function collectOverrides(installed: CliModule[]): Promise<Overrides> {
  const overrides: Overrides = { packageNames: new Set(), paths: new Set() };
  for (const module of installed) {
    const { packageName, commands } = OpaqueCliModule.toInternal(module);
    overrides.packageNames.add(packageName);
    for (const registration of await commands) {
      const { command, if: condition } = unwrapCliCommand(registration);
      if (!condition) {
        overrides.paths.add(command.path.join(' '));
      }
    }
  }
  return overrides;
}

/**
 * Applies the overrides of installed modules to a default module. The rules
 * are:
 *
 * 1. A default module whose package name matches an installed module is
 *    dropped, since it would otherwise register its commands twice.
 * 2. A default command without `if` is dropped when an installed module
 *    registers the same path without `if`.
 * 3. Everything else is kept. Commands with `if` are never dropped, and which
 *    one runs is decided when the command is invoked, falling back to the
 *    command without `if`.
 *
 * @returns The module to use, or `undefined` if nothing is left of it.
 */
async function applyOverrides(
  module: CliModule,
  overrides: Overrides,
): Promise<CliModule | undefined> {
  const { packageName, commands } = OpaqueCliModule.toInternal(module);
  if (overrides.packageNames.has(packageName)) {
    return undefined;
  }

  const all = await commands;
  const kept = all.filter(registration => {
    const { command, if: condition } = unwrapCliCommand(registration);
    return condition || !overrides.paths.has(command.path.join(' '));
  });
  if (kept.length === 0) {
    return undefined;
  }
  if (kept.length === all.length) {
    return module;
  }
  return OpaqueCliModule.createInstance('v1', {
    packageName,
    commands: Promise.resolve(kept),
  });
}

export class CliInitializer {
  #uninitiazedFeatures: Promise<TaggedFeature[]>[] = [];

  add(feature: UninitializedFeature) {
    if (isPromise(feature)) {
      this.#uninitiazedFeatures.push(
        feature.then(f => {
          const unwrapped = unwrapFeature(f.default);
          if (Array.isArray(unwrapped)) {
            return unwrapped.map(m => ({ feature: m, isDefault: true }));
          }
          return [{ feature: unwrapped, isDefault: false }];
        }),
      );
    } else if (Array.isArray(feature)) {
      this.#uninitiazedFeatures.push(
        Promise.resolve(feature.map(m => ({ feature: m, isDefault: true }))),
      );
    } else {
      this.#uninitiazedFeatures.push(
        Promise.resolve([{ feature, isDefault: false }]),
      );
    }
  }

  async #doInit(): Promise<CliModule[]> {
    const resolvedGroups = await Promise.all(this.#uninitiazedFeatures);
    const features = resolvedGroups.flat();

    for (const { feature } of features) {
      if (!OpaqueCliModule.isType(feature)) {
        throw new Error(`Unsupported feature type: ${(feature as any).$$type}`);
      }
    }

    // All installed modules are known before the defaults are filtered, so
    // the order in which modules were added does not matter.
    const installed = features.filter(f => !f.isDefault).map(f => f.feature);
    const defaults = features.filter(f => f.isDefault).map(f => f.feature);

    const overrides = await collectOverrides(installed);
    const keptDefaults = await Promise.all(
      defaults.map(module => applyOverrides(module, overrides)),
    );

    return [
      ...installed,
      ...keptDefaults.filter((m): m is CliModule => m !== undefined),
    ];
  }

  /**
   * Actually parse argv and pass it to the command.
   */
  async run() {
    const modules = await this.#doInit();
    await runCli({ modules, name: 'backstage-cli', version });
  }
}

/** @internal */
export function unwrapFeature(
  feature: CliModule | CliModule[] | { default: CliModule | CliModule[] },
): CliModule | CliModule[] {
  if (Array.isArray(feature)) {
    return feature;
  }

  if ('$$type' in feature) {
    return feature;
  }

  // This is a workaround where default exports get transpiled to `exports['default'] = ...`
  // in CommonJS modules, which in turn results in a double `{ default: { default: ... } }` nesting
  // when importing using a dynamic import.
  // TODO: This is a broader issue than just this piece of code, and should move away from CommonJS.
  if ('default' in feature) {
    return feature.default;
  }

  return feature;
}

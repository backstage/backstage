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

import { OpaqueCliModule } from '@internal/cli';
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
   * Whether this module was sourced from an array (e.g. cli-defaults).
   * Array-sourced modules are silently skipped when any of their commands
   * overlap with an individually-added module, allowing explicit module
   * additions to take precedence without causing conflicts.
   */
  fromArray: boolean;
}

export class CliInitializer {
  #uninitiazedFeatures: Promise<TaggedFeature[]>[] = [];

  add(feature: UninitializedFeature) {
    if (isPromise(feature)) {
      this.#uninitiazedFeatures.push(
        feature.then(f => {
          const unwrapped = unwrapFeature(f.default);
          if (Array.isArray(unwrapped)) {
            return unwrapped.map(m => ({ feature: m, fromArray: true }));
          }
          return [{ feature: unwrapped, fromArray: false }];
        }),
      );
    } else if (Array.isArray(feature)) {
      this.#uninitiazedFeatures.push(
        Promise.resolve(feature.map(m => ({ feature: m, fromArray: true }))),
      );
    } else {
      this.#uninitiazedFeatures.push(
        Promise.resolve([{ feature, fromArray: false }]),
      );
    }
  }

  async #doInit(): Promise<CliModule[]> {
    const resolvedGroups = await Promise.all(this.#uninitiazedFeatures);
    const allFeatures = resolvedGroups.flat();

    // Collect command paths from individually-added modules
    const individualPaths = new Set<string>();
    for (const { feature, fromArray } of allFeatures) {
      if (!fromArray && OpaqueCliModule.isType(feature)) {
        const cmds = await OpaqueCliModule.toInternal(feature).commands;
        for (const cmd of cmds) {
          individualPaths.add(cmd.path.join(' '));
        }
      }
    }

    const modules: CliModule[] = [];
    for (const { feature, fromArray } of allFeatures) {
      if (!OpaqueCliModule.isType(feature)) {
        throw new Error(`Unsupported feature type: ${(feature as any).$$type}`);
      }

      if (fromArray) {
        const cmds = await OpaqueCliModule.toInternal(feature).commands;
        if (cmds.some(cmd => individualPaths.has(cmd.path.join(' ')))) {
          continue;
        }
      }
      modules.push(feature);
    }

    return modules;
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

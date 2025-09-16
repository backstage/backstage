/*
 * Copyright 2025 The Backstage Authors
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

import { Host, Runtime, SharedDependencies } from './types';
import { default as serialize } from 'serialize-javascript';
import type { UserOptions } from '@module-federation/runtime/types';
import { ForwardedError } from '@backstage/errors';

const BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL =
  '__backstage-module-federation-shared-dependencies__';

/**
 * Prepares the runtime shared dependencies script for the module federation host,
 * which will be written by the CLI into a Javascript file added as an additional entry point for the frontend bundler.
 * This script is used in the browser to build the list of shared dependencies provided to the module federation runtime.
 *
 * @see {@link buildRuntimeSharedUserOption}
 *
 * @param hostSharedDependencies - The shared dependencies for the module federation host.
 * @returns The runtime shared dependencies script.
 *
 * @public
 */
export function prepareRuntimeSharedDependenciesScript(
  hostSharedDependencies: SharedDependencies<Host & { version: string }>,
) {
  const runtimeSharedDependencies: SharedDependencies<Host & Runtime> =
    Object.fromEntries(
      Object.entries(hostSharedDependencies).map(([name, sharedDep]) => [
        name,
        {
          version: sharedDep.version,
          requiredVersion: sharedDep.requiredVersion,
          ...(sharedDep.singleton !== undefined
            ? { singleton: sharedDep.singleton }
            : {}),
          ...(sharedDep.eager !== undefined ? { eager: sharedDep.eager } : {}),
          // eslint-disable-next-line no-new-func
          module: new Function(
            `return () => import('${name}')`,
          )() as () => Promise<any>,
        },
      ]),
    );

  return `window['${BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL}'] = ${serialize(
    runtimeSharedDependencies,
    {
      space: 2,
      unsafe: true,
    },
  )};`;
}

/**
 * Builds the list of shared dependencies provided to the module federation runtime.
 * It uses the runtime shared dependencies script prepared by {@link prepareRuntimeSharedDependenciesScript}.
 *
 * @public
 */
export async function buildRuntimeSharedUserOption(): Promise<{
  shared: UserOptions['shared'];
  errors: ForwardedError[];
}> {
  const runtimeSharedDependencies =
    (
      window as {
        [BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL]?: SharedDependencies<
          Host & Runtime
        >;
      }
    )[BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL] ?? {};

  const result: UserOptions['shared'] = {};
  const errors: ForwardedError[] = [];
  for (const [name, sharedDep] of Object.entries(runtimeSharedDependencies)) {
    try {
      const module = await sharedDep.module();
      result[name] = {
        version: sharedDep.version,
        lib: () => module,
        shareConfig: {
          singleton: sharedDep.singleton,
          requiredVersion: sharedDep.requiredVersion,
          eager: sharedDep.eager,
        },
      };
    } catch (e) {
      errors.push(
        new ForwardedError(
          `Failed to dynamically import "${name}" and add it to module federation shared dependencies:`,
          e,
        ),
      );
    }
  }

  return { shared: result, errors };
}

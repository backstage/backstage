/*
 * Copyright 2022 The Backstage Authors
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
import type { PlatformScript, PSValue } from 'platformscript';
import * as ps from 'platformscript';
import { createComponent } from './createComponent';
import { createModuleResolver } from './createModuleResolver';
import { Fragment } from './Fragment';
import { log } from './log';

export type ModuleResolvers = Record<string, () => Promise<PSValue>>;

function exportAsExternals(m) {
  return ps.external(m, ([path]) => {
    if (!Object.hasOwn(m, path)) {
      throw new Error(
        `\`${path}\` is not exported from package. Did you mean one of ${Object.keys(
          m,
        ).join(', ')}?`,
      );
    }
    return ps.external(m[path]);
  });
}

export function globals(interpreter: PlatformScript) {
  return ps.map({
    B: ps.map({
      '<>': Fragment,
      toJS: ps.fn(
        function* toJS({ arg, env }) {
          const $arg = yield* env.eval(arg);

          return ps.external(ps.ps2js($arg));
        },
        { name: 'object' },
      ),
      log,
      Component: createComponent(interpreter),
      resolve: createModuleResolver({
        'react-router-dom': () =>
          import('react-router-dom').then(exportAsExternals),
        '@material-ui/core': () =>
          import('@material-ui/core').then(exportAsExternals),
        '@backstage/core-components': () =>
          import('@backstage/core-components').then(exportAsExternals),
        '@backstage/plugin-catalog': () =>
          import('@backstage/plugin-catalog').then(exportAsExternals),
        '@backstage/plugin-catalog-react': () =>
          import('@backstage/plugin-catalog-react').then(exportAsExternals),
      }),
    }),
  });
}

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
import { PlatformScript, PSValue } from 'platformscript';
import * as ps from 'platformscript';
import { Component } from './Component';
import { createModuleResolver } from './createModuleResolver';
import { Fragment } from './Fragment';
import { log } from './log';
import { psMakeStylesFn } from './makeStyles';

export type ModuleResolvers = Record<string, () => Promise<PSValue>>;

export function globals(interpreter: PlatformScript) {
  return ps.map({
    B: ps.map({
      '<>': Fragment,
      log,
      Component: Component,
      resolve: createModuleResolver({
        '@material-ui/core/Card': () =>
          import('@material-ui/core/Card').then(m => ps.external(m.default)),
        '@material-ui/core/CardHeader': () =>
          import('@material-ui/core/CardHeader').then(m =>
            ps.external(m.default),
          ),
        '@material-ui/core/Divider': () =>
          import('@material-ui/core/CardHeader').then(m =>
            ps.external(m.default),
          ),
        '@material-ui/core/Typography': () =>
          import('@material-ui/core/Typography').then(m =>
            ps.external(m.default),
          ),
        '@material-ui/core/Grid': () =>
          import('@material-ui/core/Grid').then(m => ps.external(m.default)),
        '@backstage/core-components': () =>
          import('@backstage/core-components').then(m =>
            ps.external(m, ([path]) => ps.external(m[path])),
          ),
        '@backstage/integration-react': () =>
          import('@backstage/integration-react').then(m =>
            ps.external(m, ([path]) => ps.external(m[path])),
          ),
        '@backstage/plugin-catalog-react': () =>
          import('@backstage/plugin-catalog-react').then(m =>
            ps.external(m, ([path]) => ps.external(m[path])),
          ),
        '@material-ui/core/styles/makeStyles': () =>
          import('@material-ui/core/styles/makeStyles').then(psMakeStylesFn),
        
      }),
    }),
  });
}

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

export type ModuleResolvers = Record<string, () => Promise<PSValue>>;

export function globals(interpreter: PlatformScript) {
  return ps.map({
    B: ps.map({
      '<>': Fragment,
      log,
      Component: Component,
      resolve: createModuleResolver({
        '@material-ui/core': () =>
          import('@material-ui/core').then(m =>
            ps.external(m, ([path]) => ps.external(m[path])),
          ),
        '@backstage/core-components': () =>
          import('@backstage/core-components').then(m =>
            ps.external(m, ([path]) => ps.external(m[path])),
          ),
      }),
    }),
  });
}
